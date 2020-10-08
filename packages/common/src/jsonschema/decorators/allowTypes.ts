import {JSONSchema6TypeName} from "json-schema";
import {Any} from "./any";

/**
 * Set the type of the array items.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Any@@ from @tsed/schema instead of @@AllowTypes@@ from @tsed/common.
 * :::
 *
 * ## Example
 * ### With multiple types
 *
 * ```typescript
 * class Model {
 *    @AllowTypes("string", "number", "boolean", "array")
 *    property: "string" | "number" | "boolean" | "array";
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
 *    property: ("string" | "number" | "boolean" | "array")[];
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
 * @schema
 * @swagger
 * @validation
 * @deprecated Use @Any decorator from @tsed/common instead of. Will be removed in v6.
 */
export function AllowTypes(type: JSONSchema6TypeName, ...types: JSONSchema6TypeName[]) {
  return Any(type, ...types);
}
