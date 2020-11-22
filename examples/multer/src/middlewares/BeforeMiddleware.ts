import {Middleware, Req} from "@tsed/common";


@Middleware()
export class BeforeMiddleware {
  use(@Req() req: Req) {
    console.log("Do something before");
  }
}
