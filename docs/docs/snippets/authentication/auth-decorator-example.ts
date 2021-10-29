import {IAuthOptions, UseAuth} from "@tsed/platform-middlewares";
import {useDecorators} from "@tsed/core";
import {Security, Returns} from "@tsed/schema";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

export interface ICustomAuthOptions extends IAuthOptions {
  role?: string;
  scopes?: string[];
}

export function CustomAuth(options: ICustomAuthOptions = {}): Function {
  return useDecorators(
    UseAuth(CustomAuthMiddleware, options),
    Security("oauth", ...(options.scopes || [])),
    Returns(401),
    Returns(403)
  );
}
