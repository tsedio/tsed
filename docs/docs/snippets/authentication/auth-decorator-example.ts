import {UseAuth} from "@tsed/platform-middlewares";
import {useDecorators} from "@tsed/core";
import {Security, Returns} from "@tsed/schema";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

export interface AuthOpts extends Record<string, unknown> {
  role?: string;
  scopes?: string[];
}

export function CustomAuth(options: AuthOpts = {}): Function {
  return useDecorators(
    UseAuth(CustomAuthMiddleware, options),
    Security("oauth", ...(options.scopes || [])),
    Returns(401),
    Returns(403)
  );
}
