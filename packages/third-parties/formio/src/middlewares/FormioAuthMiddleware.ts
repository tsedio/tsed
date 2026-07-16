import {Context} from "@tsed/platform-params";
import {FormioService} from "../services/FormioService.js";
import {Inject} from "@tsed/di";
import {Middleware} from "@tsed/platform-middlewares";
import {Unauthorized} from "@tsed/exceptions";
import {getValue} from "@tsed/core";
import {promisify} from "node:util";

/**
 * @middleware
 * @formio
 */
@Middleware()
export class FormioAuthMiddleware {
  @Inject()
  protected formio!: FormioService;

  get tokenHandler(): any {
    return promisify(this.formio.middleware.tokenHandler);
  }

  async use(@Context() ctx: Context) {
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    await this.tokenHandler(req, res);

    if (!getValue(req, "token.user._id")) {
      throw new Unauthorized("User unauthorized");
    }
  }
}
