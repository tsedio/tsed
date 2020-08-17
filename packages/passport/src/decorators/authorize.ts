import {UseAuth} from "@tsed/common";
import {AuthenticateOptions} from "passport";
import {PassportMiddleware} from "../middlewares/PassportMiddleware";

export interface AuthorizeOptions extends AuthenticateOptions {
  security?: {[key: string]: string[]};
  originalUrl?: boolean;
}

export function Authorize(protocol: string | string[] = "*", options: AuthorizeOptions = {}): Function {
  return UseAuth(PassportMiddleware, {
    protocol,
    method: "authorize",
    security: options.security,
    originalUrl: options.originalUrl === undefined ? true : options.originalUrl,
    options
  });
}
