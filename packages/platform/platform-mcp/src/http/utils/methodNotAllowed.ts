import type {PlatformContext} from "@tsed/platform-http";

/**
 * Answers the methods of the Streamable HTTP transport that a stateless endpoint does not serve,
 * so MCP clients know there is no event stream instead of receiving the application's 404 page.
 *
 * @param $ctx Context of the request.
 * @param allow Methods served by the endpoint, sent in the `Allow` header.
 */
export function methodNotAllowed($ctx: PlatformContext, allow = "POST") {
  return $ctx.response
    .status(405)
    .setHeaders({allow})
    .body({jsonrpc: "2.0", error: {code: -32000, message: "Method not allowed."}, id: null});
}
