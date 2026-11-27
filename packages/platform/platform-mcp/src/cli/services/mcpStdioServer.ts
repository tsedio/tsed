import type {McpServer} from "@modelcontextprotocol/server";
import {logger} from "@tsed/di";

export async function mcpStdioServer(server: McpServer) {
  const {StdioServerTransport} = await import("@modelcontextprotocol/server/stdio");

  const transport = new StdioServerTransport();

  // stdout is reserved for the MCP protocol; a logger without stop() (e.g. console) is left untouched
  logger().stop?.();

  return server.connect(transport);
}
