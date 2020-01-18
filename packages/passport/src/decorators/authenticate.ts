import {UseAuth} from "@tsed/common";
import {PassportMiddleware} from "../middlewares/PassportMiddleware";

export function Authenticate(protocol: string | string[], options: any = {}): Function {
  return UseAuth(PassportMiddleware, {
    protocol,
    method: "authorize",
    security: options.security,
    options
  });
}
