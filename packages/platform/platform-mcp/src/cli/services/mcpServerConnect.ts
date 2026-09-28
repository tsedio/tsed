import {inject, logger} from "@tsed/di";

import {createMcpServer, MCP_SERVER} from "../../common/index.js";
import {mcpStdioServer} from "./mcpStdioServer.js";
import {mcpStreamableServer} from "./mcpStreamableServer.js";

export async function mcpServerConnect(mode: "streamable-http" | "stdio") {
  if (mode === "streamable-http") {
    logger().info({event: "MCP_SERVER_CONNECT", mode});

    return mcpStreamableServer(createMcpServer);
  }

  const server = inject(MCP_SERVER);
  await mcpStdioServer(server);

  return server;
}
