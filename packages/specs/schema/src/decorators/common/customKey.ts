import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {JsonEntityFn} from "./jsonEntityFn.js";

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
/**
 * Set a group of custom keys on JsonSchema that is not a part of the official spec.
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
export function CustomKeys(obj: Record<string, any>) {
  return JsonEntityFn((store: JsonEntityStore) => {
    Object.entries(obj).forEach(([key, value]) => {
      store.itemSchema.customKey(key, value);
    });
  });
}
