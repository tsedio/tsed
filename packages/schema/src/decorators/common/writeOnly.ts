import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";
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
