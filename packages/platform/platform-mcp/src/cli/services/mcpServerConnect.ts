import {inject, logger} from "@tsed/di";

import {MCP_SERVER} from "../../common/index.js";
import {mcpStdioServer} from "./mcpStdioServer.js";
import {mcpStreamableServer} from "./mcpStreamableServer.js";

export async function mcpServerConnect(mode: "streamable-http" | "stdio") {
  const server = inject(MCP_SERVER);

  if (mode === "streamable-http") {
    logger().info({event: "MCP_SERVER_CONNECT", mode});

    await mcpStreamableServer(server);
  } else {
    await mcpStdioServer(server);
  }

  return server;
}
