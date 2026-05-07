import type {ServerOptions} from "@modelcontextprotocol/sdk/server/index.js";
import type {StreamableHTTPServerTransportOptions} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type {Implementation} from "@modelcontextprotocol/sdk/types.js";
import type {TokenProvider} from "@tsed/di";

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
}

declare global {
  namespace TsED {
    interface Configuration {
      mcp?: PlatformMcpSettings;
    }
  }
}
