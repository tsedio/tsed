import type {AuthInfo} from "@modelcontextprotocol/server";
import type {TokenProvider} from "@tsed/di";
import type {PlatformContext} from "@tsed/platform-http";

export type PlatformMcpPreAuthResult = AuthInfo | undefined | Promise<AuthInfo | undefined>;

/**
 * Custom authentication check of an MCP endpoint, run before the OAuth verification.
 *
 * - Return an `AuthInfo` to authenticate the request: the OAuth verification is skipped and the identity is exposed
 *   to the handlers.
 * - Return `undefined` when the check does not apply to the request: the OAuth verification runs when the endpoint
 *   declares an issuer, and the request is rejected with `401` otherwise.
 * - Throw to reject the request.
 *
 * @module platform/mcp
 */
export interface PlatformMcpPreAuth {
  preAuth($ctx: PlatformContext): PlatformMcpPreAuthResult;
}

/**
 * Accepted forms of the `auth.preAuth` option: a function, or a DI token resolving to a
 * {@link PlatformMcpPreAuth} provider.
 *
 * @module platform/mcp
 */
export type PlatformMcpPreAuthOption = (($ctx: PlatformContext) => PlatformMcpPreAuthResult) | TokenProvider<PlatformMcpPreAuth>;

/**
 * Auth configuration of an MCP endpoint only protected by a custom check, without OAuth.
 *
 * @module platform/mcp
 */
export interface PlatformMcpPreAuthSettings {
  preAuth: PlatformMcpPreAuthOption;
}
