import {UseAuth} from "@tsed/common";
import {applyDecorators} from "@tsed/core";
import {In, Returns, Security} from "@tsed/schema";
import {OAuthMiddleware} from "../middlewares/OAuthMiddleware";

export function OAuth(options: any = {}): Function {
  return applyDecorators(
    UseAuth(OAuthMiddleware, options),
    Security("global_auth", ...(options.scopes || [])),
    In("header").Type(String).Name("Authorization").Required(true),
    Returns(401, String).Description("Unauthorized"),
    Returns(403, String).Description("Forbidden")
  );
}
