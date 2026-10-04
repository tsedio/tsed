import {application, type OnRoutesInit, PlatformContext, type PlatformRouteDetails} from "@tsed/platform-http";
import {constant, injectable, logger} from "@tsed/di";
import type {PlatformMcpSettings} from "../../common/index.js";
import {NodeStreamableHTTPServerTransport} from "@modelcontextprotocol/node";
import type {AuthInfo} from "@modelcontextprotocol/server";
import {useContextHandler} from "@tsed/platform-router";
import {attachUpstream} from "../../common/gateway/attachUpstream.js";
import {hasUpstreamPlaceholders} from "../../common/gateway/resolveUpstream.js";
import {createMcpServer, resolveMcpServerOptions, type CreateMcpServerOpts} from "../../common/utils/createMcpServer.js";
import {getMcpAuthMode} from "../utils/createMcpTokenVerifier.js";
import {getProtectedResourceMetadata, getProtectedResourceMetadataPath, getResourceUrl, verifyMcpRequest} from "../utils/mcpAuth.js";

async function sendResponse(res: any, response: Response) {
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(await response.text());
}

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
      this.validate(opts, path);

      const resolvedSettings = {...resolveMcpServerOptions(opts), path};

      if (opts.auth) {
        const metadataPath = getProtectedResourceMetadataPath(path);

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
  protected validate(opts: PlatformMcpSettings, path: string) {
    const {auth} = opts;

    if (auth && !auth.verifier && getMcpAuthMode(auth) === "introspection" && !(auth.clientId && auth.clientSecret)) {
      throw new Error(`MCP endpoint "${path}": the introspection mode requires auth.clientId and auth.clientSecret.`);
    }

    if (auth && !auth.verifier && auth.audience === false) {
      if (getMcpAuthMode(auth) === "offline") {
        throw new Error(`MCP endpoint "${path}": auth.audience cannot be disabled in offline mode.`);
      }

      logger().warn({
        event: "MCP_AUTH_AUDIENCE_DISABLED",
        message: `MCP endpoint "${path}": the audience check is disabled, any active token of ${auth.issuer} is accepted.`
      });
    }

    if (auth && !auth.verifier && !auth.resource && auth.audience === undefined) {
      // without it the expected audience would be derived from the Host header, which the caller controls
      throw new Error(`MCP endpoint "${path}": auth.resource (or auth.audience) is required to verify the audience of access tokens.`);
    }

    if (auth && !URL.canParse(auth.issuer)) {
      throw new Error(`MCP endpoint "${path}": auth.issuer must be an absolute URL.`);
    }

    if (auth?.resource && !URL.canParse(auth.resource)) {
      throw new Error(`MCP endpoint "${path}": auth.resource must be an absolute URL.`);
    }

    if (opts.upstream && !opts.auth && hasUpstreamPlaceholders(opts.upstream)) {
      throw new Error(`MCP endpoint "${path}": the upstream uses \${OAUTH_*} placeholders but the endpoint declares no auth.`);
    }
  }

  protected metadata(settings: CreateMcpServerOpts, $ctx: PlatformContext) {
    const auth = settings.auth!;
    const body = JSON.stringify(getProtectedResourceMetadata(auth, getResourceUrl(auth, settings.path!, $ctx)));

    return sendResponse(
      $ctx.response.getRes(),
      new Response(body, {
        headers: {
          "content-type": "application/json",
          "cache-control": "public, max-age=3600",
          "access-control-allow-origin": "*"
        }
      })
    );
  }

  protected async dispatch(settings: CreateMcpServerOpts, $ctx: PlatformContext) {
    const req = $ctx.request.getReq() as any;
    let authInfo: AuthInfo | undefined;

    if (settings.auth) {
      const result = await verifyMcpRequest(settings.auth, settings.path!, $ctx);

      if (result instanceof Response) {
        return sendResponse($ctx.response.getRes(), result);
      }

      // read by the transport and exposed to handlers as `ctx.http.authInfo`
      req.auth = authInfo = result;
    }

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
      await attachUpstream(server, settings, authInfo);
      await server.connect(transport as any);
      await transport.handleRequest(req, res, request.body);
    } finally {
      if (settings.transportOptions?.enableJsonResponse !== false) {
        res?.off?.("close", closeServer);
        await closeServer();
      }
    }
  }
}

injectable(PlatformMcpModule);
