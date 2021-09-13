import {DecoratorParameters} from "@tsed/core";
import {JsonEntityStore} from "../../domain";
import {getJsonEntityStore} from "../../utils/getJsonEntityStore";

/**
 * Decorator util to compose another decorator. See @@Description@@ decorator implementation for more details.
 *
 * ## Usage
 *
 * ```typescript
 * export function Description(description: any) {
 *   return JsonEntityFn((entity: JsonEntityStore, args: DecoratorParameters) => {
 *       entity.itemSchema.description(description)
 *   });
 * }
 * ```
 *
 * @param fn
 * @decorator
 * @utils
 * @model
 */
export function JsonEntityFn<T extends JsonEntityStore>(fn: (entity: T, parameters: DecoratorParameters) => void): (...args: any[]) => any {
  return (...parameters: DecoratorParameters) => {
    const result: any = fn(getJsonEntityStore<T>(...parameters), parameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
