import {IUseAuthOptions, UseAuth} from "@tsed/common";
import {applyDecorators} from "@tsed/core";
import {Operation, Responses, Security} from "@tsed/swagger";
import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

export interface ICustomAuthOptions extends IUseAuthOptions {
  role?: string;
  scopes?: string[];
}

export function CustomAuth(options: ICustomAuthOptions = {}): Function {
  return applyDecorators(
    UseAuth(CustomAuthMiddleware, options),
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
    Responses(403, {description: "Forbidden"})
  );
}
