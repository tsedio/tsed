import {Schema as S} from "@tsed/schema";
import {JSONSchema6} from "json-schema";

/**
 * Write data formatted to JsonSchema.
 *
 * ::: warning
 * This decorator will be removed in v7.
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
 * @ignore
 * @deprecated Since v6. Use @Schema decorator from @tsed/schema instead of.
 */
export function Schema(partialSchema: Partial<JSONSchema6>) {
  return S(partialSchema);
}
