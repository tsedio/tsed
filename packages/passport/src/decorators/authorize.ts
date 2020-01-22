import {UseAuth} from "@tsed/common";
import {AuthenticateOptions} from "passport";
import {PassportMiddleware} from "../middlewares/PassportMiddleware";

export function Authorize(protocol: string | string[], options: AuthenticateOptions & {security?: any} = {}): Function {
  return UseAuth(PassportMiddleware, {
    protocol,
    method: "authorize",
    security: options.security,
    options
  });
}
