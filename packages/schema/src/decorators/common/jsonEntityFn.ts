import {DecoratorParameters} from "@tsed/core";
import {JsonEntityStore} from "../../domain";

/**
 *
 * @param fn
 * @constructor
 */
export function JsonEntityFn(fn: (entity: JsonEntityStore, parameters: DecoratorParameters) => void): any {
  return (...parameters: DecoratorParameters) => {
    const result: any = fn(JsonEntityStore.from(...parameters), parameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
