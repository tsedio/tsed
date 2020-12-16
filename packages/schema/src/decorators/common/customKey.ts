import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Set a custom key on JsonSchema that is not a part of the official spec.
 *
 * This custom key can only be displayed if the @@getJsonSchema@@ is called with `{customKeys: true}`.
 *
 * @returns {Function}
 * @decorator
 * @validation
 * @property
 * @parameter
 * @schema
 */
export function CustomKey(key: string, value: any) {
  return JsonEntityFn((store: JsonEntityStore) => {
    store.itemSchema.customKey(key, value);
  });
}
