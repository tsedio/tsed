import {DecoratorParameters} from "@tsed/core";
import {JsonSchemaStore} from "../../domain";

/**
 *
 * @param fn
 * @constructor
 */
export function JsonSchemaStoreFn(fn: (store: JsonSchemaStore, parameters: DecoratorParameters) => void): any {
  return (...parameters: DecoratorParameters) => {
    const result: any = fn(JsonSchemaStore.from(...parameters), parameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
