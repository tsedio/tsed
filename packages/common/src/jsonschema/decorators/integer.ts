import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * Set integer type.
 *
 * ::: warning
 * This decorator will be removed in v7.
 * For v6 user, use @@Integer@@ from @tsed/schema instead of @@AllowTypes@@ from @tsed/common.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Integer()
 *    property: number;
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
 *       "type": "integer"
 *     }
 *   }
 * }
 * ```
 *
 * ### With array of multiple types
 *
 * ```typescript
 * class Model {
 *    @Integer()
 *    property: number[];
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
 *          "type": "integer"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @decorator
 * @validation
 * @swagger
 * @schema
 */
export function Integer() {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.mapper.type = "integer";
  });
}
