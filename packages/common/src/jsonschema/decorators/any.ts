import {Type} from "@tsed/core";
import {JSONSchema6TypeName} from "json-schema";
import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";
import {getJsonType} from "../utils/getJsonType";

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
 */
export function Any(...types: (JSONSchema6TypeName | Type<any> | null)[]) {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    types = types.length ? types : ["integer", "number", "string", "boolean", "array", "object", "null"];
    types = types.map(getJsonType) as any[];
    schema.mapper.type = (types.length === 1 ? types[0] : types) as any;
  });
}
