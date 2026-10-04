import {constant, logger} from "@tsed/di";

import {attachUpstream} from "../../common/gateway/attachUpstream.js";
import {hasUpstreamPlaceholders} from "../../common/gateway/resolveUpstream.js";
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

    if (options.upstream && hasUpstreamPlaceholders(options.upstream)) {
      // the CLI endpoint is not protected by OAuth, so there is no caller identity to interpolate
      throw new Error("The MCP CLI does not support ${OAUTH_*} placeholders in the upstream configuration.");
    }

    return mcpStreamableServer(async () => {
      const server = createMcpServer(options);

      await attachUpstream(server, options);

      return server;
    });
  }

  if (options.upstream) {
    logger().warn({
      event: "MCP_SERVER_CONNECT",
      message: "The MCP upstream is only exposed in streamable-http mode and is ignored in stdio mode."
    });
  }

  const server = createMcpServer(options);
  await mcpStdioServer(server);

  return server;
}
