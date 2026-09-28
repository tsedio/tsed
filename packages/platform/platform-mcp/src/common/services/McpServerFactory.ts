import {constant, injectable, ProviderScope} from "@tsed/di";
import type {PlatformMcpSettings} from "../index.js";
import {McpServer} from "@modelcontextprotocol/server";
import {createMcpServer as buildMcpServer, resolveMcpServerOptions} from "../utils/createMcpServer.js";

export function createMcpServer() {
  const settings = constant<PlatformMcpSettings>("mcp", {}) || {};
  return buildMcpServer(resolveMcpServerOptions(settings));
}

/**
 * Injectable MCP server instance configured with registered tools, resources, and prompts.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const MCP_SERVER = injectable(McpServer).factory(createMcpServer).scope(ProviderScope.INSTANCE).token();

/**
 * Type alias referencing the MCP server provider token.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export type MCP_SERVER = typeof MCP_SERVER;
