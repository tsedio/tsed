import type {PlatformContext} from "@tsed/platform-http";

/**
 * Answers the methods of the Streamable HTTP transport that a stateless endpoint does not serve,
 * so MCP clients know there is no event stream instead of receiving the application's 404 page.
 */
export function methodNotAllowed($ctx: PlatformContext) {
  return $ctx.response
    .status(405)
    .setHeaders({allow: "POST"})
    .body({jsonrpc: "2.0", error: {code: -32000, message: "Method not allowed."}, id: null});
}
