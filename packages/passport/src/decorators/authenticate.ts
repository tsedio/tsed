import {UseAuth} from "@tsed/common";
import {AuthenticateOptions as PassportAuthenticateOptions} from "passport";
import {PassportMiddleware} from "../middlewares/PassportMiddleware";

export interface AuthenticateOptions extends PassportAuthenticateOptions {
  security?: {[key: string]: string[]};
  originalUrl?: boolean;
}

export function Authenticate(protocol: string | string[] = "*", options: AuthenticateOptions = {}): Function {
  return UseAuth(PassportMiddleware, {
    protocol,
    method: "authenticate",
    security: options.security,
    originalUrl: options.originalUrl === undefined ? true : options.originalUrl,
    options
  });
}
