import {Type} from "@tsed/core";
import {Any as A} from "@tsed/schema";
import {JSONSchema6TypeName} from "json-schema";

/**
 * Set the type of the array items.
 *
 * ::: warning
 * For v6 user, use @@Any@@ from @tsed/schema instead of @tsed/common.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Any()
 *    property: any;
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
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @ignore
 * @deprecated Since v6. Use @Any decorator from @tsed/schema instead of.
 */
export function Any(...types: (Type<any> | JSONSchema6TypeName | null)[]) {
  return A(...types);
}
