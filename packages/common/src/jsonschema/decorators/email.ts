import {Email as E} from "@tsed/schema";

/**
 * Apply an email validation on property.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Format@@ from @tsed/schema instead of @tsed/common.
 * :::
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
 *    @CollectionOf(String)
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
 * @validation
 * @property
 * @ignore
 * @deprecated Use @Email decorator from @tsed/schema instead of.
 */
export function Email() {
  return E();
}
