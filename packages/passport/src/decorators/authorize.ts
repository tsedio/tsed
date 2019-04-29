import {UseAuth} from "@tsed/common";
import {AuthorizeMiddleware} from "../middlewares/AuthorizeMiddleware";

export function Authorize(protocol: string, options: any = {}): Function {
  return UseAuth(AuthorizeMiddleware, {protocol, security: options.security, options});
}
