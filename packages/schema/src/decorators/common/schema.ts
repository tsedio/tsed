import {JSONSchema6} from "json-schema";
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
 * @decorator
 * @property
 * @param partialSchema
 * @returns {Function}
 */
export function Schema(partialSchema: Partial<JSONSchema6>) {
  return JsonEntityFn((entity) => {
    Object.entries(partialSchema).forEach(([key, value]) => {
      entity.schema.set(key, value);
    });
  });
}
