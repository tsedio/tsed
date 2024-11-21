import {Constant, Injectable} from "@tsed/di";
import {PlatformContext} from "@tsed/platform-http";
import {Writable} from "stream";

import {ViteConfig} from "../interfaces/ViteConfig.js";
import {ViteRenderContext} from "../interfaces/ViteRenderContext.js";

@Injectable()
export class ViteService {
  static moduleName = "vike/server";

  @Constant("vite", {})
  protected config: ViteConfig;

  @Constant("vite.enableStream", false)
  private enableStream: boolean;

  async render(
    viewPath: string,
    {$ctx, ...opts}: {$ctx: PlatformContext} & Record<string, any>
  ): Promise<string | {pipe(stream: Writable): void} | undefined> {
    const urlOriginal = $ctx.request.url;

    const {data} = $ctx;
    const view = viewPath.replace(".vite", "");

    const pageProps = {
      view,
      ...$ctx.response.locals,
      ...opts,
      ...data
    };

    const contextProps: ViteRenderContext = {
      host: $ctx.request.host,
      protocol: $ctx.request.protocol,
      method: $ctx.request.method,
      url: urlOriginal,
      secure: $ctx.request.secure,
      headers: $ctx.request.headers,
      session: $ctx.request.session,
      stateSnapshot: this.config.stateSnapshot && this.config.stateSnapshot()
    };

    const {renderPage} = await import("vike/server");

    const pageContext = await renderPage({
      view,
      urlOriginal,
      pageProps,
      contextProps,
      userAgent: $ctx.request.headers["user-agent"]
    });

    if (pageContext.errorWhileRendering) {
      $ctx.logger.error({
        event: "VITE_RENDER_ERROR",
        error: pageContext.errorWhileRendering
      });
    }

    if (pageContext.httpResponse) {
      const {httpResponse} = pageContext;
      httpResponse.headers?.forEach(([name, value]: [string, string]) => $ctx.response.setHeader(name, value));
      $ctx.response.status(Math.max(httpResponse.statusCode, $ctx.response.statusCode));

      if (this.enableStream) {
        return httpResponse;
      }

      return httpResponse.body;
    }
  }
}
