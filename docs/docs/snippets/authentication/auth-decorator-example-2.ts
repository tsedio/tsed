import {In, Returns, Security} from "@tsed/schema";
import {UseAuth} from "@tsed/platform-middlewares";
import {useDecorators} from "@tsed/core";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

export interface CustomAuthOptions extends Record<string, unknown> {
  role?: string;
  scopes?: string[];
}

export function CustomAuth(options: CustomAuthOptions = {}): Function {
  return useDecorators(
    UseAuth(CustomAuthMiddleware, options),
    Security("oauth", ...(options.scopes || [])),
    In("header").Name("Authorization").Type(String).Required(true),
    Returns(401),
    Returns(403)
  );
}
