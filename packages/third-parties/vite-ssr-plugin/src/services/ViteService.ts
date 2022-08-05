import {Constant, PlatformContext} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {renderPage} from "vite-plugin-ssr";

import {ViteConfig} from "../interfaces/ViteConfig";
import {ViteRenderContext} from "../interfaces/ViteRenderContext";

@Injectable()
export class ViteService {
  @Constant("vite", {})
  protected config: ViteConfig;

  async render(viewPath: string, $ctx: PlatformContext) {
    const url = $ctx.request.url;

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
      url,
      secure: $ctx.request.secure,
      headers: $ctx.request.headers,
      session: $ctx.request.session,
      stateSnapshot: this.config.stateSnapshot && this.config.stateSnapshot(),
      data: pageProps
    };

    const pageContext = await renderPage({
      url,
      pageProps,
      contextProps
    });

    if (pageContext.httpResponse) {
      const {
        httpResponse: {body, statusCode, contentType}
      } = pageContext;

      $ctx.response.status(statusCode).setHeader("Content-Type", contentType);

      return body;
    }
  }
}
