import {Req} from "@tsed/common";
import {Middleware} from "@tsed/platform-middlewares";

@Middleware()
export class CustomMiddleware {
  use(@Req() req: Req) {
    console.log("ID", req.id);
  }
}
