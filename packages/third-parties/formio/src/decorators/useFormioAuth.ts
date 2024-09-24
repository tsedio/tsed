import {UseAuth} from "@tsed/common";

import {FormioAuthMiddleware} from "../middlewares/FormioAuthMiddleware.js";

/**
 * Check if a user is connected by using the Formio Auth middleware
 * @decorator
 * @formio
 */
export function UseFormioAuth(): Function {
  return UseAuth(FormioAuthMiddleware);
}
