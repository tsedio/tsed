import {Constant, PlatformContext, PlatformRequest, PlatformResponse} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {renderPage} from "vite-plugin-ssr";

import {ViteConfig} from "../interfaces/ViteConfig";
import {ViteRenderContext} from "../interfaces/ViteRenderContext";

@Injectable()
export class ViteService {
  @Constant("vite", {})
  protected config: ViteConfig;

  async render(viewPath: string, $ctx: PlatformContext) {
    const pageContext = await this.renderPage(viewPath, $ctx);

    if (pageContext.httpResponse) {
      const {
        httpResponse: {body, contentType}
      } = pageContext;

      $ctx.response.setHeader("Content-Type", contentType);
      $ctx.response.status(pageContext.httpResponse?.statusCode);

      return body;
    }
  }

  async renderPage(viewPath: string, $ctx: PlatformContext<PlatformRequest, PlatformResponse>) {
    const urlOriginal = $ctx.request.url;

    const {data} = $ctx;
    const view = viewPath.replace(".vite", "");

    const pageProps = {
      view,
      ...$ctx.response.locals,
      ...data
    };

    const contextProps: ViteRenderContext = {
      view,
      host: $ctx.request.host,
      protocol: $ctx.request.protocol,
      method: $ctx.request.method,
      url: urlOriginal,
      urlOriginal,
      secure: $ctx.request.secure,
      headers: $ctx.request.headers,
      session: $ctx.request.session,
      stateSnapshot: this.config.stateSnapshot && this.config.stateSnapshot(),
      data: pageProps
    };

    const pageContext = await renderPage({
      url: urlOriginal,
      urlOriginal,
      pageProps,
      contextProps
    });

    if (pageContext.errorWhileRendering) {
      $ctx.logger.error({
        event: "VITE_RENDER_ERROR",
        error: pageContext.errorWhileRendering
      });
    }

    return pageContext;
  }
}
