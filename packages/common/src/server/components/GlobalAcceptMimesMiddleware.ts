import {NotAcceptable} from "ts-httpexceptions";
import {ServerSettingsService} from "../../config";
import {Req} from "../../filters";
import {IMiddleware, Middleware} from "../../mvc";

/**
 * @middleware
 */
@Middleware()
export class GlobalAcceptMimesMiddleware implements IMiddleware {
  constructor(private serverSettingsService: ServerSettingsService) {}

  use(@Req() request: Req) {
    const find = this.serverSettingsService.acceptMimes.find((mime: any) => !!request.accepts(mime));

    if (!find) {
      throw new NotAcceptable(this.serverSettingsService.acceptMimes.join(", "));
    }
  }
}
