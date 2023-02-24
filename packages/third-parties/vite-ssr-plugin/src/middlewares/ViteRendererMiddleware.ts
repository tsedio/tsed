import {Constant, Context, Middleware} from "@tsed/common";
import {Inject} from "@tsed/di";

import {ViteService} from "../services/ViteService";

@Middleware()
export class ViteRendererMiddleware {
  @Constant("vite.enableStream", false)
  enableStream: boolean;
  @Inject()
  protected viteService: ViteService;

  async use(@Context() $ctx: Context) {
    const pageContext = await this.viteService.renderPage("*", $ctx);
    if (pageContext.httpResponse) {
      if (this.enableStream) {
        $ctx.response.stream(pageContext.httpResponse);
      } else {
        $ctx.response.body(pageContext.httpResponse.body);
      }
    }
  }
}
