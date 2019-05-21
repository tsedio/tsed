import {Middleware, Req} from "@tsed/common";

@Middleware()
export class CustomMiddleware {
  AUTO_INCREMENT = 0;

  use(@Req() req: Req) {
    req.id = String(this.AUTO_INCREMENT++);
  }
}
