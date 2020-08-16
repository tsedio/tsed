import {useDecorators} from "@tsed/core";
import {Returns} from "@tsed/common";
import {Authenticate} from "@tsed/passport";
import {Operation, Security} from "@tsed/swagger";
import {OAuthHead} from "./OAuthHead";

export function OAuthBearer(options: any = {}): Function {
  return useDecorators(
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
    Returns(401, {description: "Unauthorized"}),
    Returns(403, {description: "Forbidden"}),
    OAuthHead()
  );
}
