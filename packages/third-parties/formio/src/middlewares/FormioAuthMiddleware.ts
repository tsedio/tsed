import {Context, Inject, Middleware} from "@tsed/common";
import {getValue} from "@tsed/core";
import {Unauthorized} from "@tsed/exceptions";
import {promisify} from "util";
import {FormioService} from "../services/FormioService";

/**
 * @middleware
 * @formio
 */
@Middleware()
export class FormioAuthMiddleware {
  @Inject()
  protected formio: FormioService;

  get tokenHandler() {
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
