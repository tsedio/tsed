import {JsonSchema, JsonSchemaObject} from "../../domain/JsonSchema";
import {SpecTypes} from "../../domain/SpecTypes";
import {JsonEntityFn} from "./jsonEntityFn";

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
 * @param partialSchema
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @classDecorator
 * @input
 */
export function Schema(partialSchema: Partial<JsonSchemaObject> | JsonSchema) {
  return JsonEntityFn((entity) => {
    Object.entries(partialSchema).forEach(([key, value]) => {
      entity.schema.set(key, value);
    });
  });
}

/**
 * Apply specific schema depending on the spec version
 * @param specType
 * @param schema
 * @decorator
 * @validation
 * @swagger
 * @schema
 * @classDecorator
 * @input
 */
export function For(specType: SpecTypes, schema: any) {
  return JsonEntityFn((entity) => {
    entity.schema.set(specType, schema);
  });
}
