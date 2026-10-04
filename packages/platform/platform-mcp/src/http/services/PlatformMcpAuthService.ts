import {
  type AuthInfo,
  bearerAuthChallengeResponse,
  type BearerAuthOptions,
  buildOAuthProtectedResourceMetadata,
  getOAuthProtectedResourceMetadataUrl,
  verifyBearerToken
} from "@modelcontextprotocol/server";
import {injectable, logger} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";
import type {McpAuthSettings} from "../../common/interfaces/McpAuthSettings.js";
import {PlatformTokenVerifier} from "../../common/domain/PlatformTokenVerifier.js";

export const PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";

/**
 * OAuth resource-server behavior of the protected MCP endpoints: configuration validation,
 * protected resource metadata and bearer token verification.
 *
 * @module platform/mcp
 */
export class PlatformMcpAuthService {
  protected verifiers = new WeakMap<McpAuthSettings, PlatformTokenVerifier>();

  /**
   * Returns the token verifier of an endpoint, created once per `auth` configuration.
   */
  getVerifier(auth: McpAuthSettings, resource: URL): PlatformTokenVerifier {
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
  async verifyMcpRequest(auth: McpAuthSettings, path: string, $ctx: PlatformContext): Promise<AuthInfo | Response> {
    const resource = this.getResourceUrl(auth, path, $ctx);

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
  validate(path: string, auth: McpAuthSettings) {
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

    if (!auth.verifier && !auth.resource && auth.audience === undefined) {
      // without it the expected audience would be derived from the Host header, which the caller controls
      throw new Error(`MCP endpoint "${path}": auth.resource (or auth.audience) is required to verify the audience of access tokens.`);
    }

    if (!URL.canParse(auth.issuer)) {
      throw new Error(`MCP endpoint "${path}": auth.issuer must be an absolute URL.`);
    }

    if (auth.resource && !URL.canParse(auth.resource)) {
      throw new Error(`MCP endpoint "${path}": auth.resource must be an absolute URL.`);
    }

    try {
      // surfaces at startup what the metadata route would otherwise fail on (insecure issuer, invalid documentation URL)
      this.getProtectedResourceMetadata(auth, new URL(auth.resource || "https://localhost"));
    } catch (error) {
      throw new Error(`MCP endpoint "${path}": invalid auth configuration. ${(error as Error).message}`);
    }
  }

  /**
   * Builds the OAuth 2.0 Protected Resource Metadata (RFC 9728) advertised for the given resource.
   *
   * @throws When the issuer is not an HTTPS URL (outside localhost) and `allowInsecureRequests` is not set.
   */
  getProtectedResourceMetadata(auth: McpAuthSettings, resource: URL) {
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
   * Canonical URL of the MCP endpoint: the configured `auth.resource`, or the URL derived from the request.
   */
  getResourceUrl(auth: McpAuthSettings, path: string, $ctx: PlatformContext) {
    return new URL(auth.resource || `${$ctx.request.protocol}://${$ctx.request.headers.host || $ctx.request.host}${path}`);
  }
}

injectable(PlatformMcpAuthService);
