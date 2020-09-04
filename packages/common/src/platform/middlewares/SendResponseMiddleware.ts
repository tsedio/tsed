import {Inject} from "@tsed/di";
import {Middleware} from "../../mvc/decorators/class/middleware";
import {Req} from "../../mvc/decorators/params/request";
import {Res} from "../../mvc/decorators/params/response";
import {IMiddleware} from "../../mvc/interfaces";
import {PlatformResponseMiddleware} from "./PlatformResponseMiddleware";

/**
 * See example to override SendResponseMiddleware [here](/docs/middlewares/override/send-response.md).
 *
 * @deprecated Will be replaced by PlatformResponseMiddleware in v6.
 */
@Middleware()
export class SendResponseMiddleware implements IMiddleware {
  @Inject()
  middleware: PlatformResponseMiddleware;

  public use(@Req() req: Req, @Res() res: Res) {
    return this.middleware.use(req.$ctx);
  }
}
