import {JSONSchema6TypeName} from "json-schema";
import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * Set the type of the array items.
 *
 * ## Example
 * ### With multiple types
 *
 * ```typescript
 * class Model {
 *    @AllowTypes("string", "number", "boolean", "array")
 *    property: "string" | "number" | "boolean" | "array";
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
 *       "type": ["string", "number", "boolean", "array"]
 *     }
 *   }
 * }
 * ```
 *
 * ### With array of multiple types
 *
 * ```typescript
 * class Model {
 *    @AllowTypes("string", "number", "boolean", "array")
 *    property: ("string" | "number" | "boolean" | "array")[];
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
 *       "type": "array",
 *       "items": {
 *          "type": ["string", "number", "boolean", "array"]
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @param type
 * @param types
 * @decorator
 * @property
 * @jsonschema
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function AllowTypes(type: JSONSchema6TypeName, ...types: JSONSchema6TypeName[]) {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.mapper.type = [type].concat(types);
  });
}
