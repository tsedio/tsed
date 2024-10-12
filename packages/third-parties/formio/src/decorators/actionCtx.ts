import {FormioAction} from "@tsed/formio-types";
import {Context} from "@tsed/platform-params";

import {SetActionItemMessage} from "../domain/FormioAction.js";

/**
 * Return the current action context with the following data:
 *
 * ```typescript
 * export type ActionCtx = {
 *  handler: string;
 *  method: string;
 *  setActionItemMessage: SetActionItemMessage;
 *  action: FormioAction;
 * };
 * ```
 * @param expression
 * @constructor
 */
export function ActionCtx(expression?: string): ParameterDecorator {
  return Context(["ACTION_CTX", expression].filter(Boolean).join("."));
}

export type ActionCtx = {
  handler: string;
  method: string;
  setActionItemMessage: SetActionItemMessage;
  action: FormioAction;
};
