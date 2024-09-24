import {useDecorators} from "@tsed/core";
import {UseAuth} from "@tsed/platform-middlewares";
import {Returns, Security} from "@tsed/schema";

import {CustomAuthMiddleware} from "../guards/CustomAuthMiddleware";

export interface AuthOpts extends Record<string, unknown> {
  role?: string;
  scopes?: string[];
}

export function CustomAuth(options: AuthOpts = {}): Function {
  return useDecorators(UseAuth(CustomAuthMiddleware, options), Security("oauth", ...(options.scopes || [])), Returns(401), Returns(403));
}
