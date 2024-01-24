import {Constant, PlatformContext} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {Writable} from "stream";
import {VikeConfig} from "../interfaces/VikeConfig";
import {VikeRenderContext} from "../interfaces/VikeRenderContext";

@Injectable()
export class VikeService {
  @Constant("vike", {})
  protected config: VikeConfig;

  @Constant("vike.enableStream", false)
  private enableStream: boolean;

  async render(
    viewPath: string,
    {$ctx, ...opts}: {$ctx: PlatformContext} & Record<string, any>
  ): Promise<string | {pipe(stream: Writable): void} | undefined> {
    const urlOriginal = $ctx.request.url;

    const {data} = $ctx;
    const view = viewPath.replace(".vike", "");

    const pageProps = {
      view,
      ...$ctx.response.locals,
      ...opts,
      ...data
    };

    const contextProps: VikeRenderContext = {
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
      contextProps
    });

    if (pageContext.errorWhileRendering) {
      $ctx.logger.error({
        event: "VIKE_RENDER_ERROR",
        error: pageContext.errorWhileRendering
      });
    }

    if (pageContext.httpResponse) {
      const {httpResponse} = pageContext;

      $ctx.response.contentType(httpResponse.contentType).status(httpResponse.statusCode);

      if (this.enableStream) {
        return httpResponse;
      }

      return httpResponse.body;
    }
  }
}
