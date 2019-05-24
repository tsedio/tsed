import {JsonSchema} from "../class/JsonSchema";
import {decoratorSchemaFactory} from "../utils/decoratorSchemaFactory";

/**
 * Write data formatted to JsonSchema.
 *
 * ## Example
 *
 * ```typescript
 * @Schema({title: "test"})
 * class Model {
 *    @Schema({formatMinimum: "1987-10-24"})
 *    @Format("date")
 *    birthDate: Date
 * }
 * ```
 *
 * Will produce:
 *
 * ```json
 * {
 *   "type": "object",
 *   "title": "test",
 *   "properties": {
 *     "birthdate": {
 *        "type": "string",
 *        "format": "date",
 *        "formatMinimum": "1987-10-24"
 *     }
 *   }
 * }
 * ```
 *
 * @decorator
 * @jsonschema
 * @ajv
 * @swagger
 * @property
 * @param partialSchema
 * @returns {Function}
 */
export function Schema(partialSchema: Partial<JsonSchema>) {
  return decoratorSchemaFactory((schema: JsonSchema) => {
    schema.merge(partialSchema);
  });
}
