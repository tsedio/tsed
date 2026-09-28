import {application, type OnRoutesInit, PlatformContext, type PlatformRouteDetails} from "@tsed/platform-http";
import {constant, injectable} from "@tsed/di";
import type {PlatformMcpSettings} from "../../common/index.js";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";
import {useContextHandler} from "@tsed/platform-router";
import {createMcpServer, resolveMcpServerOptions, type CreateMcpServerOpts} from "../../common/utils/createMcpServer.js";

/**
 * Platform module that mounts the MCP HTTP endpoint and forwards requests to the configured server instance.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export class PlatformMcpModule implements OnRoutesInit {
  protected settings = constant<PlatformMcpSettings | PlatformMcpSettings[]>("mcp", {});
  protected app = application();
  protected mcps: PlatformRouteDetails[] = [];
  private loaded = false;

  $onRoutesInit() {
    if (this.loaded) {
      return;
    }

    const allSettings = ([] as PlatformMcpSettings[]).concat(this.settings);

    for (const opts of allSettings) {
      if (opts.enabled === false) {
        continue;
      }

      const path = opts.path || "/mcp";
      const resolvedSettings = resolveMcpServerOptions(opts);

      this.app.post(
        path,
        useContextHandler(async ($ctx) => this.dispatch(resolvedSettings, $ctx as PlatformContext))
      );

      this.mcps.push({
        method: "POST",
        name: "PlatformMcpModule.dispatch()",
        url: path
      } as PlatformRouteDetails);
    }

    this.loaded = true;
  }

  $logRoutes(routes: PlatformRouteDetails[]) {
    return [...routes, ...this.mcps].filter(Boolean);
  }

  protected async dispatch(settings: CreateMcpServerOpts, $ctx: PlatformContext) {
    const server = createMcpServer(settings);

    const transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
      ...settings.transportOptions
    });

    const {request, response} = $ctx;
    const res = response.getRes() as any;
    let closed = false;

    const closeServer = async () => {
      if (closed) {
        return;
      }

      closed = true;
      await server.close();
    };

    res?.once("close", closeServer);

    try {
      await server.connect(transport as any);
      await transport.handleRequest(request.getReq(), res, request.body);
    } finally {
      res?.off?.("close", closeServer);
      await closeServer();
    }
  }
}

injectable(PlatformMcpModule);
