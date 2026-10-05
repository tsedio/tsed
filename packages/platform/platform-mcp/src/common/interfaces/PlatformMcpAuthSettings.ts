import type {OAuthTokenVerifier} from "@modelcontextprotocol/server";
import type {TokenProvider} from "@tsed/di";
import type {PlatformMcpPreAuthOption} from "./PlatformMcpPreAuth.js";

/**
 * OAuth 2.1 resource-server configuration of a Ts.ED MCP endpoint.
 *
 * The endpoint never issues tokens: clients are redirected to the configured authorization server,
 * where registration and consent happen.
 *
 * @module platform/mcp
 */
export interface PlatformMcpAuthSettings {
  /**
   * Custom authentication check run before the OAuth verification, for instance an API key.
   * When it returns an identity, the OAuth verification is skipped: both methods are accepted on the endpoint.
   */
  preAuth?: PlatformMcpPreAuthOption;
  /**
   * Issuer URL of the authorization server (OIDC provider) protecting the endpoint.
   */
  issuer: string;
  /**
   * How access tokens are verified:
   *
   * - `offline`: the JWT access token (RFC 9068, `typ: at+jwt`) is validated locally against the authorization server JWKS.
   * - `introspection`: the authorization server is asked for each token (RFC 7662). Requires `clientId` and `clientSecret`.
   *
   * Defaults to `introspection` when `clientId` is set, `offline` otherwise.
   */
  mode?: "offline" | "introspection";
  /**
   * Credentials of the MCP endpoint on the authorization server, used to call the introspection endpoint.
   */
  clientId?: string;
  clientSecret?: string;
  /**
   * Expected audience of the access tokens. Defaults to `resource`.
   *
   * `false` disables the audience check. It is only accepted by the `introspection` mode and makes the endpoint
   * accept any active token of the issuer, whatever the resource it was issued for.
   */
  audience?: string | false;
  /**
   * JWKS URL used by the `offline` mode. Discovered from the issuer metadata by default.
   */
  jwksUri?: string;
  /**
   * Introspection URL used by the `introspection` mode. Discovered from the issuer metadata by default.
   */
  introspectionEndpoint?: string;
  /**
   * Time in seconds an introspection result is reused. Defaults to `60`; `0` disables the cache.
   */
  cacheTtl?: number;
  /**
   * Allow a non-HTTPS issuer (other than `localhost`). For local development only.
   */
  allowInsecureRequests?: boolean;
  /**
   * Custom access token verifier replacing the built-in modes: an object implementing
   * `verifyAccessToken(token)` or a DI token resolving to one.
   */
  verifier?: OAuthTokenVerifier | TokenProvider<OAuthTokenVerifier>;
  /**
   * Canonical public URL of the MCP endpoint. It is advertised in the protected resource metadata and in the
   * bearer challenge, and is the expected audience of access tokens unless `audience` is set.
   *
   * It is required and never derived from the incoming request, whose `Host` header is controlled by the caller.
   */
  resource: string;
  /**
   * Scopes advertised in the protected resource metadata.
   */
  scopesSupported?: string[];
  /**
   * Scopes a token must carry to reach the endpoint.
   */
  requiredScopes?: string[];
  /**
   * Human-readable name advertised in the protected resource metadata.
   */
  resourceName?: string;
  /**
   * Documentation URL advertised in the protected resource metadata.
   */
  resourceDocumentation?: string;
}
