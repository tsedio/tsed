"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * An object instance is valid against `minProperties` if its number of properties is greater than, or equal to, the value of this keyword.
 *
 * ::: warning
 * The value of this keyword MUST be a non-negative integer.
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
 *    @Any()
 *    @MinProperties(10)
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
 *       "type": "any",
 *       "minProperties": 10
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} minProperties
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @jsonschema
 */
function MinProperties(minProperties) {
    if (minProperties < 0) {
        throw new Error("The value of minProperties MUST be a non-negative integer.");
    }
    return decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        schema.minProperties = minProperties;
    });
}
exports.MinProperties = MinProperties;
//# sourceMappingURL=minProperties.js.map