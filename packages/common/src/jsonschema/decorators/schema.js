"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
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
function Schema(partialSchema) {
    return decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        schema.merge(partialSchema);
    });
}
exports.Schema = Schema;
//# sourceMappingURL=schema.js.map