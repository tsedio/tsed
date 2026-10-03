import {Err} from "@tsed/platform-http";
import {Middleware} from "@tsed/platform-middlewares";

@Middleware()
export class MyMiddlewareError {
  use(@Err() err: unknown) {
    console.log("===> Error:", err);
  }
}
