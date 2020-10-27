import {In} from "@tsed/schema";
import {IAuthOptions, Returns, UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {Operation, Security} from "@tsed/swagger";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

export interface ICustomAuthOptions extends IAuthOptions {
  role?: string;
  scopes?: string[];
}

export function CustomAuth(options: ICustomAuthOptions = {}): Function {
  return useDecorators(
    UseAuth(CustomAuthMiddleware, options),
    Security("oauth", ...(options.scopes || [])),
    In("header").Name("Authorization").Type(String).Required(true),
    Returns(401, {description: "Unauthorized"}),
    Returns(403, {description: "Forbidden"})
  );
}
