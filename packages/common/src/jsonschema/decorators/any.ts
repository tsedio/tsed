import {JSONSchema6TypeName} from "json-schema";
import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * Set the type of the array items.
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
 * @returns {Function}
 * @param types
 * @decorator
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function Any(...types: JSONSchema6TypeName[]) {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.mapper.type = ["integer", "number", "string", "boolean", "array", "object", "null"];
  });
}
