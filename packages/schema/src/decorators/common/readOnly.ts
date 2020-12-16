import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";
/**
 * Set the property as readOnly.
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 */
export function ReadOnly(readOnly: boolean = true) {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.itemSchema.readOnly(readOnly);
  });
}
