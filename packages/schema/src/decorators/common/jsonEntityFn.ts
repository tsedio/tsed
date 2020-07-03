import {DecoratorParameters} from "@tsed/core";
import {JsonEntityStore} from "../../domain";

/**
 *
 * @param fn
 * @constructor
 */
export function JsonEntityFn<T extends JsonEntityStore>(fn: (entity: T, parameters: DecoratorParameters) => void): any {
  return (...parameters: DecoratorParameters) => {
    const result: any = fn(JsonEntityStore.from<T>(...parameters), parameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
