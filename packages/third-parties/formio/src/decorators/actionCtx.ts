import {Context} from "@tsed/common";
import {FormioAction, SetActionItemMessage} from "../domain/FormioAction";

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
