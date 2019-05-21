import {IMiddleware, Middleware, Req, ServerSettingsService} from "@tsed/common";
import {NotAcceptable} from "ts-httpexceptions";

@Middleware()
export default class GlobalAcceptMimesMiddleware implements IMiddleware {
  constructor(private serverSettingsService: ServerSettingsService) {
  }

  use(@Req() request: Req) {
    this.serverSettingsService.acceptMimes
      .forEach((mime) => {
        if (!request.accepts(mime)) {
          throw new NotAcceptable(mime);
        }
      });
  }
}
