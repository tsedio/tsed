import {Req} from "@tsed/platform-http";
import {Middleware} from "@tsed/platform-middlewares";

@Middleware()
export class CreateRequestSessionMiddleware {
  use(@Req() request: Req) {
    if (request.session) {
      request.session.user = request.session.user || {
        id: null
      };
    }
  }
}
