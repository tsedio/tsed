import {Format} from "./format";

/**
 * Apply an email validation on property.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @Email()
 *    property: string;
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
 *       "type": "string",
 *       "format": "email"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @Email()
 *    @PropertyType(String)
 *    property: string[];
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
 *          "type": "string",
 *          "format": "email"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * > See [Format](api/common/jsonschema/schema) decorator.
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @jsonschema
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
export function Email() {
  return Format("email");
}
