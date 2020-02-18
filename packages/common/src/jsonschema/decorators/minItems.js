"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 *
 * An array instance is valid against `minItems` if its size is greater than, or equal to, the value of this keyword.
 *
 * ::: warning
 * The value `minItems` MUST be a non-negative integer.
 * :::
 *
 * ::: tip
 * Omitting this keyword has the same behavior as a value of 0.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @MinItems(10)
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
 *       "type": "number",
 *       "minItems": 10
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minItems
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @jsonschema
 */
function MinItems(minItems) {
    if (minItems < 0) {
        throw new Error("The value of minItems MUST be a non-negative integer.");
    }
    return decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        schema.minItems = minItems;
    });
}
exports.MinItems = MinItems;
//# sourceMappingURL=minItems.js.map