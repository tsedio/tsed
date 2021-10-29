import {In} from "@tsed/schema";
import {IAuthOptions, UseAuth} from "@tsed/platform-middlewares";
import {useDecorators} from "@tsed/core";
import {Security, Returns} from "@tsed/schema";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

export interface CustomAuthOptions extends IAuthOptions {
  role?: string;
  scopes?: string[];
}

export function CustomAuth(options: CustomAuthOptions = {}): Function {
  return useDecorators(
    UseAuth(CustomAuthMiddleware, options),
    Security("oauth", ...(options.scopes || [])),
    In("header").Name("Authorization").Type(String).Required(true),
    Returns(401, {description: "Unauthorized"}),
    Returns(403, {description: "Forbidden"})
  );
}
