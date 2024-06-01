import {Context} from "@tsed/common";
import {SetActionItemMessage} from "../domain/FormioAction.js";
import {FormioAction} from "@tsed/formio-types";

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
