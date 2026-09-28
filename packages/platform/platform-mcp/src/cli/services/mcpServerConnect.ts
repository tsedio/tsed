import {constant, inject, logger} from "@tsed/di";

import {MCP_SERVER} from "../../common/index.js";
import type {PlatformMcpSettings} from "../../common/interfaces/PlatformMcpSettings.js";
import {createMcpServer, resolveMcpServerOptions} from "../../common/utils/createMcpServer.js";
import {mcpStdioServer} from "./mcpStdioServer.js";
import {mcpStreamableServer} from "./mcpStreamableServer.js";

export async function mcpServerConnect(mode: "streamable-http" | "stdio") {
  if (mode === "streamable-http") {
    logger().info({event: "MCP_SERVER_CONNECT", mode});
    const settings = constant<PlatformMcpSettings>("mcp", {}) || {};
    const options = resolveMcpServerOptions(settings);

    return mcpStreamableServer(() => createMcpServer(options));
  }

  const server = inject(MCP_SERVER);
  await mcpStdioServer(server);

  return server;
}
