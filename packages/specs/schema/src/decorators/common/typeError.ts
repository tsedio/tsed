import {ErrorMsg} from "./errorMsg.js";
import {JsonEntityFn} from "./jsonEntityFn.js";
import {useDecorators} from "@tsed/core";

/**
 * Create a new custom formats validator
 * @param name
 * @param options
 * @decorator
 * @ajv
 */
export function TypeError(msg: string): ClassDecorator {
  return JsonEntityFn(() => useDecorators(ErrorMsg({type: msg})));
}
