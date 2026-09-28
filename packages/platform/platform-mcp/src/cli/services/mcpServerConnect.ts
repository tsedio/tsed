import {constant, logger} from "@tsed/di";

import type {PlatformMcpSettings} from "../../common/interfaces/PlatformMcpSettings.js";
import {createMcpServer, resolveMcpServerOptions} from "../../common/utils/createMcpServer.js";
import {mcpStdioServer} from "./mcpStdioServer.js";
import {mcpStreamableServer} from "./mcpStreamableServer.js";

export async function mcpServerConnect(mode: "streamable-http" | "stdio") {
  const settings = constant<PlatformMcpSettings | PlatformMcpSettings[]>("mcp", {}) || {};

  if (Array.isArray(settings)) {
    throw new Error("The MCP CLI supports a single MCP server configuration.");
  }

  const options = resolveMcpServerOptions(settings);

  if (mode === "streamable-http") {
    logger().info({event: "MCP_SERVER_CONNECT", mode});

    return mcpStreamableServer(() => createMcpServer(options));
  }

  const server = createMcpServer(options);
  await mcpStdioServer(server);

  return server;
}
