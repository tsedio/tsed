import {
  type AuthInfo,
  bearerAuthChallengeResponse,
  type BearerAuthOptions,
  buildOAuthProtectedResourceMetadata,
  getOAuthProtectedResourceMetadataUrl,
  verifyBearerToken
} from "@modelcontextprotocol/server";
import {inject, injectable, injector, logger, type TokenProvider} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";
import type {
  PlatformMcpAuthSettings,
  PlatformMcpPreAuth,
  PlatformMcpPreAuthOption,
  PlatformMcpPreAuthSettings
} from "../../common/index.js";
import {PlatformTokenVerifier} from "../../common/index.js";

export const PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";

/**
 * OAuth resource-server behavior of the protected MCP endpoints: configuration validation,
 * protected resource metadata and bearer token verification.
 *
 * @module platform/mcp
 */
export class PlatformMcpAuthService {
  protected verifiers = new WeakMap<PlatformMcpAuthSettings, PlatformTokenVerifier>();

  /**
   * Tells whether the endpoint is protected by an OAuth authorization server, and not only by a custom check.
   */
  isOAuth(auth?: PlatformMcpAuthSettings | PlatformMcpPreAuthSettings): auth is PlatformMcpAuthSettings {
    return Boolean((auth as PlatformMcpAuthSettings)?.issuer);
  }

  /**
   * Runs the custom authentication check of an endpoint.
   *
   * @returns The identity of the caller, or `undefined` when the check does not apply to the request.
   */
  async preAuth(preAuth: PlatformMcpPreAuthOption, $ctx: PlatformContext): Promise<AuthInfo | undefined> {
    if (!injector().providers.has(preAuth)) {
      // not a registered provider: the option is the check itself
      return (preAuth as ($ctx: PlatformContext) => AuthInfo | undefined)($ctx);
    }

    const instance = inject(preAuth as TokenProvider<PlatformMcpPreAuth>);

    return instance.preAuth($ctx);
  }

  /**
   * Returns the token verifier of an endpoint, created once per `auth` configuration.
   */
  getVerifier(auth: PlatformMcpAuthSettings, resource: URL): PlatformTokenVerifier {
    let verifier = this.verifiers.get(auth);

    if (!verifier) {
      verifier = new PlatformTokenVerifier(auth, resource);
      this.verifiers.set(auth, verifier);
    }

    return verifier;
  }

  /**
   * Verifies the bearer token of the incoming request.
   *
   * @returns The verified identity, or the `401`/`403` challenge to send back to the client.
   */
  async verifyMcpRequest(auth: PlatformMcpAuthSettings, $ctx: PlatformContext): Promise<AuthInfo | Response> {
    const resource = this.getResourceUrl(auth);

    const options = {
      verifier: this.getVerifier(auth, resource),
      requiredScopes: auth.requiredScopes,
      resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resource)
    } satisfies BearerAuthOptions;

    try {
      return await verifyBearerToken($ctx.request.headers.authorization, options);
    } catch (error) {
      return bearerAuthChallengeResponse(error, options);
    }
  }

  /**
   * Rejects an `auth` configuration that cannot work or would be unsafe, before any route is mounted.
   */
  validate(path: string, auth: PlatformMcpAuthSettings) {
    const mode = PlatformTokenVerifier.getMode(auth);

    if (!auth.verifier && mode === "introspection" && !(auth.clientId && auth.clientSecret)) {
      throw new Error(`MCP endpoint "${path}": the introspection mode requires auth.clientId and auth.clientSecret.`);
    }

    if (!auth.verifier && auth.audience === false) {
      if (mode === "offline") {
        throw new Error(`MCP endpoint "${path}": auth.audience cannot be disabled in offline mode.`);
      }

      logger().warn({
        event: "MCP_AUTH_AUDIENCE_DISABLED",
        message: `MCP endpoint "${path}": the audience check is disabled, any active token of ${auth.issuer} is accepted.`
      });
    }

    if (!auth.resource) {
      // the resource is never derived from the request: the Host header is controlled by the caller
      throw new Error(`MCP endpoint "${path}": auth.resource is required.`);
    }

    if (!URL.canParse(auth.resource)) {
      throw new Error(`MCP endpoint "${path}": auth.resource must be an absolute URL.`);
    }

    if (!URL.canParse(auth.issuer)) {
      throw new Error(`MCP endpoint "${path}": auth.issuer must be an absolute URL.`);
    }

    try {
      // surfaces at startup what the metadata route would otherwise fail on (insecure issuer, invalid documentation URL)
      this.getProtectedResourceMetadata(auth, this.getResourceUrl(auth));
    } catch (error) {
      throw new Error(`MCP endpoint "${path}": invalid auth configuration. ${(error as Error).message}`);
    }
  }

  /**
   * Builds the OAuth 2.0 Protected Resource Metadata (RFC 9728) advertised for the given resource.
   *
   * @throws When the issuer is not an HTTPS URL (outside localhost) and `allowInsecureRequests` is not set.
   */
  getProtectedResourceMetadata(auth: PlatformMcpAuthSettings, resource: URL) {
    return buildOAuthProtectedResourceMetadata({
      // the SDK builder only reads the issuer of the authorization server metadata
      oauthMetadata: {issuer: auth.issuer} as never,
      resourceServerUrl: resource,
      scopesSupported: auth.scopesSupported,
      resourceName: auth.resourceName,
      serviceDocumentationUrl: auth.resourceDocumentation ? new URL(auth.resourceDocumentation) : undefined,
      dangerouslyAllowInsecureIssuerUrl: auth.allowInsecureRequests
    });
  }

  /**
   * Path of the RFC 9728 metadata document describing the MCP endpoint mounted on `path`.
   */
  getProtectedResourceMetadataPath(path: string) {
    return `${PROTECTED_RESOURCE_METADATA_PATH}${path === "/" ? "" : path}`;
  }

  /**
   * Canonical URL of the MCP endpoint, as configured in `auth.resource`.
   *
   * It is used for the metadata document, the bearer challenge and the expected audience, and is never
   * derived from the incoming request.
   */
  getResourceUrl(auth: PlatformMcpAuthSettings) {
    return new URL(auth.resource);
  }
}

injectable(PlatformMcpAuthService);
