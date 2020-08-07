import {JSONSchema6} from "json-schema";
import {JsonEntityFn} from "./jsonEntityFn";

/**
 * Write data formatted to JsonSchema.
 *
 * ::: warning
 * For v6 user, use @@Schema@@ from @tsed/schema instead of @tsed/common.
 * :::
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
export function Schema(partialSchema: Partial<JSONSchema6>) {
  return JsonEntityFn((entity) => {
    Object.entries(partialSchema).forEach(([key, value]) => {
      entity.schema.set(key, value);
    });
  });
}
