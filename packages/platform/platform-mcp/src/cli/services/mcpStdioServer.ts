import type {McpServer} from "@modelcontextprotocol/server";
import {logger} from "@tsed/di";

export async function mcpStdioServer(server: McpServer) {
  const {StdioServerTransport} = await import("@modelcontextprotocol/server/stdio");

  const transport = new StdioServerTransport();

  logger().stop();

  return server.connect(transport);
}
