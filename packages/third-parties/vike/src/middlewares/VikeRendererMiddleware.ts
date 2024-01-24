import {Context, Middleware} from "@tsed/common";
import {Inject} from "@tsed/di";

import {VikeService} from "../services/VikeService";

@Middleware()
export class VikeRendererMiddleware {
  @Inject()
  protected vikeService: VikeService;

  async use(@Context() $ctx: Context) {
    const response = await this.vikeService.render("*", {$ctx});

    response && !$ctx.response.isDone() && $ctx.response.body(response);
  }
}
