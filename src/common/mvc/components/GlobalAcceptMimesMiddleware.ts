import {NotAcceptable} from "ts-httpexceptions";
import {ServerSettingsService} from "../../config/services/ServerSettingsService";
import {Request} from "../../filters/decorators/request";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/index";

/**
 * @middleware
 */
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
