import type {Implementation, ServerOptions} from "@modelcontextprotocol/server";
import type {StreamableHTTPServerTransportOptions} from "@modelcontextprotocol/node";
import type {TokenProvider} from "@tsed/di";
import type {PlatformMcpAuthSettings} from "./PlatformMcpAuthSettings.js";
import type {PlatformMcpPreAuthSettings} from "./PlatformMcpPreAuth.js";
import type {PlatformMcpUpstreamSettings} from "./PlatformMcpUpstreamSettings.js";

/**
 * Configuration fragment accepted under `configuration.mcp` to wire the Platform MCP module.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export interface PlatformMcpSettings {
  /**
   * Mount path for the MCP endpoint. Defaults to `/mcp`.
   */
  path?: string;
  /**
   * Whether the HTTP endpoint should be enabled. Defaults to `true`.
   */
  enabled?: boolean;
  /**
   * Optional name reported to MCP clients. Falls back to the Ts.ED app name.
   */
  name?: string;
  /**
   * Optional version reported to MCP clients. Falls back to the Ts.ED app version.
   */
  version?: string;
  /**
   * Optional human-readable server title exposed to MCP clients.
   */
  title?: Implementation["title"];
  /**
   * Optional server description exposed to MCP clients.
   */
  description?: Implementation["description"];
  /**
   * Optional canonical website URL exposed to MCP clients.
   */
  websiteUrl?: Implementation["websiteUrl"];
  /**
   * Optional icon descriptors exposed to MCP clients.
   */
  icons?: Implementation["icons"];
  /**
   * Optional tokens registered through configuration.
   */
  tools?: TokenProvider[];
  resources?: TokenProvider[];
  prompts?: TokenProvider[];
  /**
   * Optional low-level MCP server options forwarded to `new McpServer(serverInfo, options)`.
   */
  serverOptions?: ServerOptions;
  /**
   * Optional transport options for the MCP server.
   */
  transportOptions?: StreamableHTTPServerTransportOptions;
  /**
   * Third-party MCP server exposed through this endpoint (gateway mode).
   */
  upstream?: PlatformMcpUpstreamSettings;
  /**
   * Protect the HTTP endpoint: with an OAuth authorization server (`issuer`, `resource`, ...), with a custom
   * check (`preAuth`), or with both.
   */
  auth?: PlatformMcpAuthSettings | PlatformMcpPreAuthSettings;
  /**
   * Let MCP clients running in a browser (e.g. the MCP Inspector) call the endpoint: answers the CORS preflight
   * and adds the CORS headers to every response of the endpoint, 401 challenges included, exposing the
   * `WWW-Authenticate`, `Mcp-Session-Id` and `Mcp-Protocol-Version` headers.
   *
   * `true` allows any origin. Disabled by default, so an application keeps its own CORS middleware.
   */
  cors?: boolean | PlatformMcpCorsSettings;
}

/**
 * CORS options of an MCP endpoint.
 *
 * @module platform/mcp
 */
export interface PlatformMcpCorsSettings {
  /**
   * Origins allowed to call the endpoint: `"*"` (default) or a list of origins, echoed back when the request
   * comes from one of them.
   */
  origin?: "*" | string[];
  /**
   * Seconds a browser may cache the preflight response. Defaults to `600`.
   */
  maxAge?: number;
}

declare global {
  namespace TsED {
    interface Configuration {
      mcp?: PlatformMcpSettings | PlatformMcpSettings[];
    }
  }
}
