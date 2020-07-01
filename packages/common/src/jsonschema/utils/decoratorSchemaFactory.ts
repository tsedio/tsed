import {DecoratorParameters} from "@tsed/core";
import {JsonEntityFn} from "@tsed/schema";
import {JsonSchema} from "../class/JsonSchema";

/**
 * @ignore
 * @deprecated Will be remove in v6.
 * @param {(schema: JsonSchema, parameters: DecoratorParameters) => void} fn
 * @returns {(...parameters: any[]) => any}
 * @deprecated Will be removed in v6
 */
export function decoratorSchemaFactory(fn: (schema: JsonSchema, parameters: DecoratorParameters) => void) {
  return JsonEntityFn((entity, parameters) => {
    return fn(entity.itemSchema as any, parameters);
  });
}
