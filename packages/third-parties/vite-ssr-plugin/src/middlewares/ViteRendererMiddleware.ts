import {Constant, Context, Middleware} from "@tsed/common";
import {Inject} from "@tsed/di";

import {ViteService} from "../services/ViteService";

@Middleware()
export class ViteRendererMiddleware {
  @Inject()
  protected viteService: ViteService;

  async use(@Context() $ctx: Context) {
    const response = await this.viteService.render("*", {$ctx});

    response && $ctx.response.body(response);
  }
}
