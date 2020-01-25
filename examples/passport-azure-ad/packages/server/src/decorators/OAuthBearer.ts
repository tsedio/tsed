import {applyDecorators} from "@tsed/core";
import {Authenticate} from "@tsed/passport";
import {Operation, Responses, Security} from "@tsed/swagger";
import {OAuthHead} from "./OAuthHead";

export function OAuthBearer(options: any = {}): Function {
  return applyDecorators(
    Authenticate("azure-bearer", {session: false, ...options}),
    // Metadata for swagger
    Security("oauth", ...(options.scopes || [])),
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
    Responses(403, {description: "Forbidden"}),
    OAuthHead()
  );
}
