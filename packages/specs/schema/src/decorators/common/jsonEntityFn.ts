import {DecoratorParameters} from "@tsed/core";

import type {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {getJsonEntityStore} from "../../utils/getJsonEntityStore.js";

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
export function JsonEntityFn<T extends JsonEntityStore = JsonEntityStore>(
  fn: (entity: T, parameters: DecoratorParameters) => any
): (...args: any[]) => any {
  return (...parameters: DecoratorParameters) => {
    const result: any = fn(getJsonEntityStore<T>(...parameters) as T, parameters);
    if (typeof result === "function") {
      result(...parameters);
    }
  };
}
