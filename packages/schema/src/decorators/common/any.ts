import {Type} from "@tsed/core";
import {JSONSchema6TypeName} from "json-schema";
import {JsonSchemaStoreFn} from "./jsonSchemaStoreFn";

/**
 * Set the type of the array items.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Any()
 *    property: any;
 *
 *    @Any(String, Number, Boolean)
 *    property: string | number | boolean;
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": ["integer", "number", "string", "boolean", "array", "object", "null"]
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function Any(...types: (JSONSchema6TypeName | Type<any>)[]) {
  return JsonSchemaStoreFn(store => {
    store.itemSchema.any(...types);
  });
}
