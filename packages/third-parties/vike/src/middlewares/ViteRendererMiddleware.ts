import {Inject} from "@tsed/di";
import {Middleware} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

import {ViteService} from "../services/ViteService.js";

@Middleware()
export class ViteRendererMiddleware {
  @Inject()
  protected viteService: ViteService;

  async use(@Context() $ctx: Context) {
    const response = await this.viteService.render("*", {$ctx});

    response && !$ctx.response.isDone() && $ctx.response.body(response);
  }
}
