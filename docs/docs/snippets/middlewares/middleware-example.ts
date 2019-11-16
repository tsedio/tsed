import {Middleware, Req} from "@tsed/common";

@Middleware()
export class CustomMiddleware {
  use(@Req() req: Req) {
    console.log("ID", req.id);
  }
}
