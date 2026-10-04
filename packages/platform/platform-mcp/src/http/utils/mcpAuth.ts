import {
  type AuthInfo,
  bearerAuthChallengeResponse,
  buildOAuthProtectedResourceMetadata,
  getOAuthProtectedResourceMetadataUrl,
  OAuthError,
  OAuthErrorCode,
  type OAuthTokenVerifier,
  verifyBearerToken
} from "@modelcontextprotocol/server";
import {isFunction} from "@tsed/core";
import {inject} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";
import type {McpAuthSettings} from "../../common/interfaces/McpAuthSettings.js";
import {createMcpTokenVerifier} from "./createMcpTokenVerifier.js";

export const PROTECTED_RESOURCE_METADATA_PATH = "/.well-known/oauth-protected-resource";

/**
 * Path of the RFC 9728 metadata document describing the MCP endpoint mounted on `path`.
 */
export function getProtectedResourceMetadataPath(path: string) {
  return `${PROTECTED_RESOURCE_METADATA_PATH}${path === "/" ? "" : path}`;
}

/**
 * Canonical URL of the MCP endpoint: the configured `auth.resource`, or the URL derived from the request.
 */
export function getResourceUrl(auth: McpAuthSettings, path: string, $ctx: PlatformContext) {
  return new URL(auth.resource || `${$ctx.request.protocol}://${$ctx.request.headers.host || $ctx.request.host}${path}`);
}

/**
 * Builds the OAuth 2.0 Protected Resource Metadata (RFC 9728) advertised for an MCP endpoint.
 *
 * @throws When the issuer is not an HTTPS URL (outside localhost) and `allowInsecureRequests` is not set.
 */
export function getProtectedResourceMetadata(auth: McpAuthSettings, resource: URL) {
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

function getVerifier(auth: McpAuthSettings, resource: URL): OAuthTokenVerifier {
  const {verifier} = auth;

  if (!verifier) {
    return createMcpTokenVerifier(auth, resource);
  }

  const instance = isFunction((verifier as OAuthTokenVerifier).verifyAccessToken)
    ? (verifier as OAuthTokenVerifier)
    : inject<OAuthTokenVerifier>(verifier as never);

  return {
    async verifyAccessToken(token) {
      try {
        return await instance.verifyAccessToken(token);
      } catch (error) {
        // any verifier failure means the token cannot be trusted: answer with a 401 challenge without leaking the cause
        throw error instanceof OAuthError ? error : new OAuthError(OAuthErrorCode.InvalidToken, "Invalid access token");
      }
    }
  };
}

/**
 * Verifies the bearer token of the incoming request.
 *
 * @returns The verified identity, or the `401`/`403` challenge to send back to the client.
 */
export async function verifyMcpRequest(auth: McpAuthSettings, path: string, $ctx: PlatformContext): Promise<AuthInfo | Response> {
  const resource = getResourceUrl(auth, path, $ctx);
  const options = {
    verifier: getVerifier(auth, resource),
    requiredScopes: auth.requiredScopes,
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resource)
  };

  try {
    return await verifyBearerToken($ctx.request.headers.authorization, options);
  } catch (error) {
    return bearerAuthChallengeResponse(error, options);
  }
}
