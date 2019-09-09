import {Constant, IMiddleware, Middleware, Req} from "@tsed/common";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export default class GlobalAcceptMimesMiddleware implements IMiddleware {
  @Constant("acceptMimes")
  acceptMimes: string[];

  use(@Req() request: Req) {
    this.acceptMimes
      .forEach((mime) => {
        if (!request.accepts(mime)) {
          throw new NotAcceptable(mime);
        }
      });
  }
}
