"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * An object instance is valid against `maxProperties` if its number of properties is less than, or equal to, the value of this keyword.
 *
 * !> The value of this keyword MUST be a non-negative integer.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Any()
 *    @MaxProperties(10)
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
 *       "maxProperties": 10
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} maxProperties
 * @returns {Function}
 * @decorator
 * @ajv
 * @property
 * @jsonschema
 */
function MaxProperties(maxProperties) {
    if (maxProperties < 0) {
        throw new Error("The value of maxProperties MUST be a non-negative integer.");
    }
    return decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        schema.maxProperties = maxProperties;
    });
}
exports.MaxProperties = MaxProperties;
//# sourceMappingURL=maxProperties.js.map