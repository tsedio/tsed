import {UseAuth} from "@tsed/common";
import {applyDecorators} from "@tsed/core";
import {Operation, Responses, Security} from "@tsed/swagger";
import {OAuthMiddleware} from "../middlewares/OAuthMiddleware";

export function OAuth(options: any = {}): Function {
  return applyDecorators(
    UseAuth(OAuthMiddleware, options),
    Security("global_auth", ...(options.scopes || [])),
    Operation({
      "parameters": [
        {
          "in": "header",
          "name": "Authorization",
          "type": "string",
          "required": true
        }
      ]
    }),
    Responses(401, {description: "Unauthorized"}),
    Responses(403, {description: "Forbidden"})
  );
}
