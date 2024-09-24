import {Middleware} from "@tsed/platform-middlewares";
import {Context} from "@tsed/platform-params";

@Middleware()
export class CustomMiddleware {
  use(@Context() $ctx: Context) {
    console.log("ID", $ctx.id);
  }
}
