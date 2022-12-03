import {useDecorators} from "@tsed/core";
import {ErrorMsg} from "./errorMsg";
import {JsonEntityFn} from "./jsonEntityFn";

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
