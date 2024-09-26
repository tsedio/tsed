import type {DecoratorParameters} from "@tsed/core";
import type {JsonParameterStore} from "@tsed/schema";
import {JsonEntityFn} from "@tsed/schema";

/**
 * Get the Param metadata. Use this decorator to compose your own decorator.
 *
 * @param fn
 * @decorator
 * @operation
 * @input
 */
export function ParamFn(fn: (param: JsonParameterStore, parameters: DecoratorParameters) => void): ParameterDecorator {
  return JsonEntityFn<JsonParameterStore>(fn);
}
