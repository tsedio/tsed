import {JSONSchema6TypeName} from "json-schema";
import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

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
 * @input
 */
export function Any(...types: JSONSchema6TypeName[]) {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.mapper.type = types.length ? types : ["integer", "number", "string", "boolean", "array", "object", "null"];
  });
}
