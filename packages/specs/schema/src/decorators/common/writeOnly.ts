import type {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";
/**
 * Set the property as WriteOnly.
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 */
export function WriteOnly(writeOnly: boolean = true) {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.itemSchema.writeOnly(writeOnly);
  });
}
