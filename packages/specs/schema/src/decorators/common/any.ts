import {Type} from "@tsed/core";
import type {JSONSchema6TypeName} from "json-schema";

import {JsonEntityFn} from "./jsonEntityFn.js";

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
 * @validation
 * @swagger
 * @schema
 * @input
 */
export function Any(...types: (JSONSchema6TypeName | Type<any> | any)[]) {
  return JsonEntityFn((store) => {
    store.itemSchema.any(...types);
  });
}
