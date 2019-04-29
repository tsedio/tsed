import {UseAuth} from "@tsed/common";
import {AuthenticateMiddleware} from "../middlewares/AuthenticateMiddleware";

export function Authenticate(protocol: string, options: any = {}): Function {
  return UseAuth(AuthenticateMiddleware, {protocol, security: options.security, options});
}
