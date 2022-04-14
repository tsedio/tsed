import {UseAuth} from "@tsed/platform-middlewares";
import {useDecorators} from "@tsed/core";
import {Security} from "@tsed/schema";
import {AuthenticateOptions} from "passport";
import {PassportMiddleware} from "../middlewares/PassportMiddleware";

export interface AuthorizeOptions extends AuthenticateOptions {
  security?: Record<string, string[]>;
  originalUrl?: boolean;
}

export function Authorize(protocol: string | string[] = "*", options: AuthorizeOptions = {}): Function {
  return useDecorators(
    UseAuth(PassportMiddleware, {
      protocol,
      method: "authorize",
      originalUrl: options.originalUrl === undefined ? true : options.originalUrl,
      options
    }),
    ...Object.entries(options.security || {}).map(([key, value]) => {
      return Security(key, ...value);
    })
  );
}
