import type {PlatformContext} from "@tsed/platform-http";
import type {PlatformMcpCorsSettings} from "../../common/interfaces/PlatformMcpSettings.js";

/**
 * Response headers a browser MCP client must read: the OAuth challenge and the Streamable HTTP session/version.
 *
 * @module platform/mcp
 */
export const MCP_CORS_EXPOSED_HEADERS = "WWW-Authenticate, Mcp-Session-Id, Mcp-Protocol-Version";

/**
 * Request headers allowed by the preflight when the browser does not list the ones it needs.
 *
 * @module platform/mcp
 */
export const MCP_CORS_ALLOWED_HEADERS = "Authorization, Content-Type, Accept, Mcp-Protocol-Version, Mcp-Session-Id, Last-Event-ID";

const DEFAULT_MAX_AGE = 600;

function appendVary(vary: unknown) {
  const values = [vary ?? []]
    .flat()
    .flatMap((value) => String(value).split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return values.some((value) => value === "*" || value.toLowerCase() === "origin") ? values.join(", ") : [...values, "Origin"].join(", ");
}

function normalize(cors?: boolean | PlatformMcpCorsSettings): PlatformMcpCorsSettings | undefined {
  if (!cors) {
    return undefined;
  }

  return cors === true ? {} : cors;
}

/**
 * Returns the CORS headers of a response of an MCP endpoint, or `undefined` when CORS is disabled.
 *
 * With a list of origins, the request origin is echoed back only when it belongs to the list, and `Origin` is added
 * to the `Vary` header already set on the response.
 *
 * @param cors `cors` option of the endpoint.
 * @param $ctx Context of the request.
 * @module platform/mcp
 */
export function getCorsHeaders(cors: boolean | PlatformMcpCorsSettings | undefined, $ctx: PlatformContext) {
  const settings = normalize(cors);

  if (!settings) {
    return undefined;
  }

  const {origin: allowed = "*"} = settings;
  const origin = $ctx.request.get("origin");
  const headers: Record<string, string> = {"access-control-expose-headers": MCP_CORS_EXPOSED_HEADERS};

  if (allowed === "*") {
    headers["access-control-allow-origin"] = "*";
  } else {
    headers.vary = appendVary($ctx.response.get("vary"));

    if (origin && allowed.includes(origin)) {
      headers["access-control-allow-origin"] = origin;
    }
  }

  if ($ctx.request.method === "OPTIONS") {
    headers["access-control-allow-methods"] = "GET, POST, DELETE, OPTIONS";
    headers["access-control-allow-headers"] = $ctx.request.get("access-control-request-headers") || MCP_CORS_ALLOWED_HEADERS;
    headers["access-control-max-age"] = String(settings.maxAge ?? DEFAULT_MAX_AGE);
  }

  return headers;
}

/**
 * Adds the CORS headers of an MCP endpoint to the response, on the framework response and on the Node.js one,
 * which the MCP transport writes directly. Does nothing when CORS is disabled.
 *
 * @param cors `cors` option of the endpoint.
 * @param $ctx Context of the request.
 * @module platform/mcp
 */
export function setCorsHeaders(cors: boolean | PlatformMcpCorsSettings | undefined, $ctx: PlatformContext) {
  const headers = getCorsHeaders(cors, $ctx);

  if (!headers) {
    return;
  }

  $ctx.response.setHeaders(headers);

  const res = $ctx.getRes();

  Object.entries(headers).forEach(([name, value]) => res?.setHeader?.(name, value));
}

export const cors = (cors: boolean | PlatformMcpCorsSettings | undefined) => ($ctx: PlatformContext) => setCorsHeaders(cors, $ctx);

export function preflight($ctx: PlatformContext) {
  return $ctx.response.status(204).body(undefined);
}
