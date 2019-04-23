import {NotAcceptable} from "ts-httpexceptions";
import {ServerSettingsService} from "../../config";
import {Request} from "../../filters";
import {IMiddleware, Middleware} from "../../mvc";

@Middleware()
export class GlobalAcceptMimesMiddleware implements IMiddleware {
  constructor(private serverSettingsService: ServerSettingsService) {}

  use(@Request() request: any) {
    const find = this.serverSettingsService.acceptMimes.find((mime: any) => request.accepts(mime));

    if (!find) {
      throw new NotAcceptable(this.serverSettingsService.acceptMimes.join(", "));
    }
  }
}
