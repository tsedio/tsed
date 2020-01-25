import {UseAuth} from "@tsed/common";
import {AuthenticateOptions} from "passport";
import {PassportMiddleware} from "../middlewares/PassportMiddleware";

export function Authenticate(protocol: string | string[] = "*", options: AuthenticateOptions & {security?: any} = {}): Function {
  return UseAuth(PassportMiddleware, {
    protocol,
    method: "authenticate",
    security: options.security,
    options
  });
}
