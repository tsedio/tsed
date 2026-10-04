import {createHash} from "node:crypto";
import {type AuthInfo, OAuthError, type OAuthTokenVerifier} from "@modelcontextprotocol/server";
import {isFunction} from "@tsed/core";
import {inject} from "@tsed/di";
import {PlatformInvalidToken} from "../errors/PlatformInvalidToken.js";
import {PlatformServerError} from "../errors/PlatformServerError.js";
import type {McpAuthSettings} from "../interfaces/McpAuthSettings.js";

const DEFAULT_CACHE_TTL = 60;
const MAX_CACHE_SIZE = 1000;
// oauth4webapi failures caused by the authorization server or the configuration, not by the presented token
const SERVER_ERROR_CODES = [
  "OAUTH_RESPONSE_IS_NOT_JSON",
  "OAUTH_RESPONSE_IS_NOT_CONFORM",
  "OAUTH_MISSING_SERVER_METADATA",
  "OAUTH_INVALID_SERVER_METADATA",
  "OAUTH_HTTP_REQUEST_FORBIDDEN",
  "OAUTH_REQUEST_PROTOCOL_FORBIDDEN"
];

type Claims = Record<string, unknown> & {
  aud?: string | string[];
  iss?: string;
  exp?: number;
  scope?: string;
  client_id?: string;
  azp?: string;
};

type OAuth = typeof import("oauth4webapi");
type AuthorizationServer = import("oauth4webapi").AuthorizationServer;

/**
 * Access token verifier of a protected MCP endpoint.
 *
 * - `offline`: validates the JWT access token (RFC 9068) against the authorization server JWKS, plus issuer, audience and expiration.
 * - `introspection`: asks the authorization server (RFC 7662) with the endpoint's client credentials.
 * - `auth.verifier`: delegates to the custom verifier, replacing the built-in modes.
 *
 * The built-in modes rely on `oauth4webapi`, imported lazily.
 *
 * @module platform/mcp
 */
export class PlatformTokenVerifier implements OAuthTokenVerifier {
  readonly mode: "offline" | "introspection";
  readonly audience: string | false;
  /**
   * Kept as a single instance per endpoint: oauth4webapi caches the JWKS against it.
   */
  protected authorizationServer?: Promise<AuthorizationServer>;
  protected cache = new Map<string, {authInfo: AuthInfo; until: number}>();

  /**
   * @param auth Auth settings of the endpoint.
   * @param resource Canonical URL of the endpoint, used as the expected audience unless `auth.audience` is set.
   */
  constructor(
    protected auth: McpAuthSettings,
    protected resource: URL
  ) {
    this.audience = auth.audience ?? resource.href;
    this.mode = PlatformTokenVerifier.getMode(auth);
  }

  /**
   * Verification mode of an endpoint: explicit `mode`, else introspection when client credentials are configured.
   */
  static getMode(auth: McpAuthSettings): "offline" | "introspection" {
    return auth.mode || (auth.clientId ? "introspection" : "offline");
  }

  verifyAccessToken(token: string): Promise<AuthInfo> {
    if (this.auth.verifier) {
      return this.verifyWithCustomVerifier(token);
    }

    return this.mode === "introspection" ? this.verifyWithIntrospection(token) : this.verifyOffline(token);
  }

  protected async verifyWithCustomVerifier(token: string) {
    const {verifier} = this.auth;
    const instance = isFunction((verifier as OAuthTokenVerifier).verifyAccessToken)
      ? (verifier as OAuthTokenVerifier)
      : inject<OAuthTokenVerifier>(verifier as never);

    try {
      return await instance.verifyAccessToken(token);
    } catch (error) {
      // any verifier failure means the token cannot be trusted: answer with a 401 challenge without leaking the cause
      throw error instanceof OAuthError ? error : new PlatformInvalidToken("Invalid access token");
    }
  }

  protected async verifyWithIntrospection(token: string) {
    const key = createHash("sha256").update(token).digest("hex");
    const now = Date.now();
    const cached = this.cache.get(key);

    if (cached && cached.until > now) {
      return cached.authInfo;
    }

    this.cache.delete(key);

    const authInfo = await this.introspect(token);
    const ttl = (this.auth.cacheTtl ?? DEFAULT_CACHE_TTL) * 1000;

    if (ttl > 0) {
      if (this.cache.size >= MAX_CACHE_SIZE) {
        this.cache.delete(this.cache.keys().next().value!);
      }

      // RFC 7662 responses may omit `exp`: the result is then cached for the whole ttl
      this.cache.set(key, {authInfo, until: authInfo.expiresAt ? Math.min(now + ttl, authInfo.expiresAt * 1000) : now + ttl});
    }

    return authInfo;
  }

  protected async verifyOffline(token: string) {
    const audience = this.audience || this.resource.href;
    const oauth = await import("oauth4webapi");
    const as = await this.getAuthorizationServer(oauth);
    // only the Authorization header of this request is read by the validation
    const request = new Request("https://resource.invalid", {headers: {authorization: `Bearer ${token}`}});

    try {
      return this.toAuthInfo(token, await oauth.validateJwtAccessToken(as, request, audience, this.getRequestOptions(oauth)));
    } catch (error) {
      const isTokenError =
        error instanceof oauth.UnsupportedOperationError ||
        (error instanceof oauth.OperationProcessingError && !SERVER_ERROR_CODES.includes(error.code!));

      // an unreachable JWKS endpoint must not be reported to the client as an invalid token
      throw isTokenError ? new PlatformInvalidToken("Invalid access token") : new PlatformServerError("Unable to verify the access token");
    }
  }

  protected async introspect(token: string) {
    const oauth = await import("oauth4webapi");
    const as = await this.getAuthorizationServer(oauth);
    let claims: Claims & {active: boolean};

    try {
      const response = await oauth.introspectionRequest(
        as,
        {client_id: this.auth.clientId!},
        oauth.ClientSecretBasic(this.auth.clientSecret!),
        token,
        this.getRequestOptions(oauth)
      );

      claims = (await oauth.processIntrospectionResponse(as, {client_id: this.auth.clientId!}, response)) as never;
    } catch {
      throw new PlatformServerError("Unable to introspect the access token");
    }

    const audiences = ([] as string[]).concat(claims.aud || []);

    if (!claims.active) {
      throw new PlatformInvalidToken("Inactive access token");
    }

    if (claims.iss && claims.iss !== this.auth.issuer) {
      throw new PlatformInvalidToken("Unexpected access token issuer");
    }

    // a token without audience is rejected: it could have been issued for another resource
    if (this.audience !== false && !audiences.includes(this.audience)) {
      throw new PlatformInvalidToken("Unexpected access token audience");
    }

    return this.toAuthInfo(token, claims);
  }

  /**
   * Resolves the authorization server metadata once per endpoint: OIDC discovery, then RFC 8414.
   * Discovery is skipped when the endpoint needed by the verification mode is configured explicitly.
   */
  protected getAuthorizationServer(oauth: OAuth): Promise<AuthorizationServer> {
    const load = async (): Promise<AuthorizationServer> => {
      const overrides = {
        ...(this.auth.jwksUri && {jwks_uri: this.auth.jwksUri}),
        ...(this.auth.introspectionEndpoint && {introspection_endpoint: this.auth.introspectionEndpoint})
      };

      if (this.mode === "introspection" ? this.auth.introspectionEndpoint : this.auth.jwksUri) {
        return {issuer: this.auth.issuer, ...overrides};
      }

      const issuer = new URL(this.auth.issuer);

      for (const algorithm of ["oidc", "oauth2"] as const) {
        try {
          const response = await oauth.discoveryRequest(issuer, {algorithm, ...this.getRequestOptions(oauth)});

          return {...(await oauth.processDiscoveryResponse(issuer, response)), ...overrides};
        } catch {
          // try the next discovery algorithm
        }
      }

      throw new PlatformServerError(`Unable to load the authorization server metadata of ${this.auth.issuer}`);
    };

    this.authorizationServer ||= load().catch((error) => {
      this.authorizationServer = undefined;

      throw error;
    });

    return this.authorizationServer;
  }

  protected toAuthInfo(token: string, claims: Claims): AuthInfo {
    const scopes = Array.isArray(claims.scp) ? (claims.scp as string[]) : String(claims.scope || "").split(" ");

    return {
      token,
      clientId: String(claims.client_id || claims.azp || ""),
      scopes: scopes.filter(Boolean),
      expiresAt: claims.exp,
      extra: claims
    };
  }

  private getRequestOptions(oauth: OAuth) {
    return this.auth.allowInsecureRequests ? {[oauth.allowInsecureRequests]: true} : {};
  }
}
