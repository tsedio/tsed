import {Context} from "@tsed/platform-params";
import {Middleware} from "@tsed/platform-middlewares";

@Middleware()
export class CustomMiddleware {
  use(@Context() $ctx: Context) {
    console.log("ID", $ctx.id);
  }
}
