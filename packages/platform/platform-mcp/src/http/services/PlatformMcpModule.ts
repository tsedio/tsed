import {application, type OnRoutesInit, type PlatformContext, type PlatformRouteDetails} from "@tsed/platform-http";
import {constant, inject, injectable} from "@tsed/di";
import type {PlatformMcpAuthSettings, PlatformMcpSettings} from "../../common/index.js";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";
import type {AuthInfo} from "@modelcontextprotocol/server";
import {useContextHandler} from "@tsed/platform-router";
import {attachUpstream} from "../../common/utils/attachUpstream.js";
import {hasUpstreamPlaceholders} from "../../common/utils/resolveUpstream.js";
import {createMcpServer, type CreateMcpServerOpts, resolveMcpServerOptions} from "../../common/utils/createMcpServer.js";
import {PlatformMcpAuthService} from "./PlatformMcpAuthService.js";

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
  protected platformAuthService = inject(PlatformMcpAuthService);
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

      this.validate(path, opts);

      const resolvedSettings = {
        ...resolveMcpServerOptions(opts),
        path
      };

      if (this.platformAuthService.isOAuth(opts.auth)) {
        const metadataPath = this.platformAuthService.getProtectedResourceMetadataPath(path);

        this.app.get(
          metadataPath,
          useContextHandler(($ctx) => this.metadata(resolvedSettings, $ctx as PlatformContext))
        );

        this.mcps.push({
          method: "GET",
          name: "PlatformMcpModule.metadata()",
          url: metadataPath
        } as PlatformRouteDetails);
      }

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

  /**
   * Rejects a configuration that cannot work or would be unsafe, before any route is mounted.
   */
  protected validate(path: string, opts: PlatformMcpSettings) {
    const {auth} = opts;

    if (this.platformAuthService.isOAuth(auth)) {
      this.platformAuthService.validate(path, auth);
    } else if (auth && !auth.preAuth) {
      throw new Error(`MCP endpoint "${path}": auth requires an issuer, a preAuth check, or both.`);
    }

    if (opts.upstream && !opts.auth && hasUpstreamPlaceholders(opts.upstream)) {
      throw new Error(`MCP endpoint "${path}": the upstream uses \${OAUTH_*} placeholders but the endpoint declares no auth.`);
    }
  }

  protected metadata(settings: CreateMcpServerOpts, $ctx: PlatformContext) {
    const auth = settings.auth as PlatformMcpAuthSettings;
    const resource = this.platformAuthService.getResourceUrl(auth);
    const body = this.platformAuthService.getProtectedResourceMetadata(auth, resource);

    return $ctx.response
      .status(200)
      .setHeaders({
        "content-type": "application/json",
        "cache-control": "public, max-age=3600",
        "access-control-allow-origin": "*"
      })
      .body(body);
  }

  protected async dispatch(settings: CreateMcpServerOpts, $ctx: PlatformContext) {
    const {auth} = settings;
    let authInfo: AuthInfo | undefined;

    if (auth?.preAuth) {
      authInfo = await this.platformAuthService.preAuth(auth.preAuth, $ctx);
    }

    if (auth && !authInfo) {
      if (!this.platformAuthService.isOAuth(auth)) {
        // the custom check did not authenticate the request and there is no OAuth to fall back on
        return $ctx.response.status(401).body({error: "unauthorized", error_description: "Authentication required"});
      }

      const result = await this.platformAuthService.verifyMcpRequest(auth, $ctx);

      if (result instanceof Response) {
        return $ctx.response
          .status(result.status)
          .setHeaders(Object.fromEntries(result.headers))
          .body(await result.text());
      }

      authInfo = result;
    }

    if (authInfo) {
      // the SDK transport reads `req.auth` and exposes it to handlers as `ctx.http.authInfo`
      ($ctx.getReq() as {auth?: AuthInfo}).auth = authInfo;
    }

    const server = createMcpServer(settings);

    const transport = new NodeStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
      ...settings.transportOptions
    });

    let closed = false;

    const closeServer = async () => {
      if (closed) {
        return;
      }

      closed = true;
      await server.close();
    };

    $ctx.getRes()?.once("close", closeServer);

    try {
      await attachUpstream(server, settings, authInfo);
      await server.connect(transport as any);
      await transport.handleRequest($ctx.getReq(), $ctx.getRes(), $ctx.request.body);
    } finally {
      if (settings.transportOptions?.enableJsonResponse !== false) {
        $ctx.getRes()?.off?.("close", closeServer);
        await closeServer();
      }
    }
  }
}

injectable(PlatformMcpModule);
