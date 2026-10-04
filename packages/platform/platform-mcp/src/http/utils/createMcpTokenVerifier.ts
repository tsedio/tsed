import {createHash} from "node:crypto";
import {type AuthInfo, OAuthError, OAuthErrorCode, type OAuthTokenVerifier} from "@modelcontextprotocol/server";
import type {McpAuthSettings} from "../../common/interfaces/McpAuthSettings.js";

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

type OAuth = typeof import("oauth4webapi");
type AuthorizationServer = import("oauth4webapi").AuthorizationServer;

interface VerifierState {
  /**
   * Kept as a single instance per endpoint: oauth4webapi caches the JWKS against it.
   */
  as?: Promise<AuthorizationServer>;
  cache: Map<string, {authInfo: AuthInfo; until: number}>;
}

type Claims = Record<string, unknown> & {
  aud?: string | string[];
  iss?: string;
  exp?: number;
  scope?: string;
  client_id?: string;
  azp?: string;
};

const states = new WeakMap<McpAuthSettings, VerifierState>();

function getState(auth: McpAuthSettings) {
  let state = states.get(auth);

  if (!state) {
    state = {cache: new Map()};
    states.set(auth, state);
  }

  return state;
}

function invalidToken(message: string) {
  return new OAuthError(OAuthErrorCode.InvalidToken, message);
}

function serverError(message: string) {
  return new OAuthError(OAuthErrorCode.ServerError, message);
}

/**
 * Verification mode of an endpoint: explicit `mode`, else introspection when client credentials are configured.
 */
export function getMcpAuthMode(auth: McpAuthSettings): "offline" | "introspection" {
  return auth.mode || (auth.clientId ? "introspection" : "offline");
}

function getRequestOptions(oauth: OAuth, auth: McpAuthSettings) {
  return auth.allowInsecureRequests ? {[oauth.allowInsecureRequests]: true} : {};
}

/**
 * Resolves the authorization server metadata once per endpoint: OIDC discovery, then RFC 8414.
 * Discovery is skipped when the endpoint needed by the verification mode is configured explicitly.
 */
function getAuthorizationServer(oauth: OAuth, auth: McpAuthSettings, state: VerifierState): Promise<AuthorizationServer> {
  const load = async (): Promise<AuthorizationServer> => {
    const overrides = {
      ...(auth.jwksUri && {jwks_uri: auth.jwksUri}),
      ...(auth.introspectionEndpoint && {introspection_endpoint: auth.introspectionEndpoint})
    };

    if (getMcpAuthMode(auth) === "introspection" ? auth.introspectionEndpoint : auth.jwksUri) {
      return {issuer: auth.issuer, ...overrides};
    }

    const issuer = new URL(auth.issuer);
    let cause: unknown;

    for (const algorithm of ["oidc", "oauth2"] as const) {
      try {
        const response = await oauth.discoveryRequest(issuer, {algorithm, ...getRequestOptions(oauth, auth)});

        return {...(await oauth.processDiscoveryResponse(issuer, response)), ...overrides};
      } catch (error) {
        cause = error;
      }
    }

    throw new OAuthError(OAuthErrorCode.ServerError, `Unable to load the authorization server metadata of ${auth.issuer}`, {
      cause
    } as never);
  };

  state.as ||= load().catch((error) => {
    state.as = undefined;

    throw error;
  });

  return state.as;
}

function toAuthInfo(token: string, claims: Claims): AuthInfo {
  const scopes = Array.isArray(claims.scp) ? (claims.scp as string[]) : String(claims.scope || "").split(" ");

  return {
    token,
    clientId: String(claims.client_id || claims.azp || ""),
    scopes: scopes.filter(Boolean),
    expiresAt: claims.exp,
    extra: claims
  };
}

async function verifyOffline(auth: McpAuthSettings, state: VerifierState, token: string, audience: string) {
  const oauth = await import("oauth4webapi");
  const as = await getAuthorizationServer(oauth, auth, state);
  // only the Authorization header of this request is read by the validation
  const request = new Request("https://resource.invalid", {headers: {authorization: `Bearer ${token}`}});

  try {
    return toAuthInfo(token, await oauth.validateJwtAccessToken(as, request, audience, getRequestOptions(oauth, auth)));
  } catch (error) {
    const isTokenError =
      error instanceof oauth.UnsupportedOperationError ||
      (error instanceof oauth.OperationProcessingError && !SERVER_ERROR_CODES.includes(error.code!));

    // an unreachable JWKS endpoint must not be reported to the client as an invalid token
    throw isTokenError ? invalidToken("Invalid access token") : serverError("Unable to verify the access token");
  }
}

async function introspect(auth: McpAuthSettings, state: VerifierState, token: string, audience: string | false) {
  const oauth = await import("oauth4webapi");
  const as = await getAuthorizationServer(oauth, auth, state);
  let claims: Claims & {active: boolean};

  try {
    const response = await oauth.introspectionRequest(
      as,
      {client_id: auth.clientId!},
      oauth.ClientSecretBasic(auth.clientSecret!),
      token,
      getRequestOptions(oauth, auth)
    );

    claims = (await oauth.processIntrospectionResponse(as, {client_id: auth.clientId!}, response)) as never;
  } catch {
    throw serverError("Unable to introspect the access token");
  }

  const audiences = ([] as string[]).concat(claims.aud || []);

  if (!claims.active) {
    throw invalidToken("Inactive access token");
  }

  if (claims.iss && claims.iss !== auth.issuer) {
    throw invalidToken("Unexpected access token issuer");
  }

  // a token without audience is rejected: it could have been issued for another resource
  if (audience !== false && !audiences.includes(audience)) {
    throw invalidToken("Unexpected access token audience");
  }

  return toAuthInfo(token, claims);
}

async function verifyWithIntrospection(auth: McpAuthSettings, state: VerifierState, token: string, audience: string | false) {
  const key = createHash("sha256").update(token).digest("hex");
  const now = Date.now();
  const cached = state.cache.get(key);

  if (cached && cached.until > now) {
    return cached.authInfo;
  }

  state.cache.delete(key);

  const authInfo = await introspect(auth, state, token, audience);
  const ttl = (auth.cacheTtl ?? DEFAULT_CACHE_TTL) * 1000;

  if (ttl > 0) {
    if (state.cache.size >= MAX_CACHE_SIZE) {
      state.cache.delete(state.cache.keys().next().value!);
    }

    state.cache.set(key, {authInfo, until: Math.min(now + ttl, (authInfo.expiresAt || 0) * 1000)});
  }

  return authInfo;
}

/**
 * Creates the built-in access token verifier of a protected MCP endpoint.
 *
 * - `offline`: validates the JWT access token (RFC 9068) against the authorization server JWKS, plus issuer, audience and expiration.
 * - `introspection`: asks the authorization server (RFC 7662) with the endpoint's client credentials.
 *
 * Both modes rely on `oauth4webapi`, imported lazily.
 *
 * @param auth Auth settings of the endpoint.
 * @param resource Canonical URL of the endpoint, used as the expected audience unless `auth.audience` is set.
 * @module platform/mcp
 */
export function createMcpTokenVerifier(auth: McpAuthSettings, resource: URL): OAuthTokenVerifier {
  const state = getState(auth);
  const audience = auth.audience ?? resource.href;

  return {
    verifyAccessToken(token) {
      return getMcpAuthMode(auth) === "introspection"
        ? verifyWithIntrospection(auth, state, token, audience)
        : verifyOffline(auth, state, token, audience || resource.href);
    }
  };
}
