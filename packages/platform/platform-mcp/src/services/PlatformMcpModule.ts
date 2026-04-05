import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {constant, inject, injectable} from "@tsed/di";
import {application, type OnRoutesInit, PlatformContext, type PlatformRouteDetails} from "@tsed/platform-http";
import {useContextHandler} from "@tsed/platform-router";

import type {PlatformMcpSettings} from "../interfaces/PlatformMcpSettings.js";
import {MCP_SERVER} from "./McpServerFactory.js";

/**
 * Platform module that mounts the MCP HTTP endpoint and forwards requests to the configured server instance.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export class PlatformMcpModule implements OnRoutesInit {
  protected settings = constant<PlatformMcpSettings>("mcp", {});
  protected app = application();
  protected server = inject<McpServer>(MCP_SERVER);

  $onRoutesInit() {
    if (this.isEnabled()) {
      const path = this.settings?.path || "/mcp";

      this.app.post(
        path,
        useContextHandler(async ($ctx) => this.dispatch($ctx as PlatformContext))
      );
    }
  }

  $logRoutes(routes: PlatformRouteDetails[]) {
    return [
      ...routes,
      this.isEnabled() && {
        method: "POST",
        name: "PlatformMcpModule.dispatch()",
        url: this.settings?.path || "/mcp"
      }
    ].filter(Boolean);
  }

  protected async dispatch($ctx: PlatformContext) {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
      ...this.settings.transportOptions
    });

    const {request, response} = $ctx;

    response.raw?.on("close", () => transport.close());

    try {
      await this.server.connect(transport as any);
      await transport.handleRequest(request.getReq(), response.getRes(), request.body);
    } finally {
      await transport.close();
    }
  }

  private isEnabled() {
    return this.settings?.enabled !== false;
  }
}

injectable(PlatformMcpModule);
