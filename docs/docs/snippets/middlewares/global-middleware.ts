import {Constant, MiddlewareMethods, Middleware, Req} from "@tsed/common";
import {NotAcceptable} from "@tsed/exceptions";

@Middleware()
export default class GlobalAcceptMimesMiddleware implements MiddlewareMethods {
  @Constant("acceptMimes")
  acceptMimes: string[];

  use(@Req() request: Req) {
    if (!request.accepts(this.acceptMimes)) {
      throw new NotAcceptable("Accepted mimes are: " + this.acceptMimes.join(", "));
    }
  }
}
