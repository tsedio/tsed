import {useDecorators} from "@tsed/core";
import {UseAuth} from "@tsed/platform-middlewares";
import {Security} from "@tsed/schema";
import {AuthenticateOptions as PassportAuthenticateOptions} from "passport";

import {PassportMiddleware} from "../middlewares/PassportMiddleware.js";

export interface AuthenticateOptions extends PassportAuthenticateOptions {
  security?: Record<string, string[]>;
  originalUrl?: boolean;
}

export function Authenticate(protocol: string | string[] = "*", options: AuthenticateOptions = {}): Function {
  return useDecorators(
    UseAuth(PassportMiddleware, {
      protocol,
      method: "authenticate",
      originalUrl: options.originalUrl === undefined ? true : options.originalUrl,
      options
    }),
    ...Object.entries(options.security || {}).map(([key, value]) => {
      return Security(key, ...value);
    })
  );
}
