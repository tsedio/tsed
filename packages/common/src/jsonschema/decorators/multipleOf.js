"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * A numeric instance is valid only if division by this keyword's value results in an integer.
 *
 * !> The value of `multipleOf` MUST be a number, strictly greater than 0.
 *
 * ## Example
 * ### With primitive type
 *
 * ```typescript
 * class Model {
 *    @MultipleOf(2)
 *    property: Number;
 * }
 * ```
 *
 * ```json
 * {
 *   "type": "object",
 *   "properties": {
 *     "property": {
 *       "type": "number",
 *       "multipleOf": 2
 *     }
 *   }
 * }
 * ```
 *
 * ### With array type
 *
 * ```typescript
 * class Model {
 *    @PropertyType(number)
 *    @MultipleOf(2)
 *    property: number[];
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
 *       "type": "array",
 *       "items": {
 *          "type": "number",
 *          "multipleOf": 2
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {number} multipleOf
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
function MultipleOf(multipleOf) {
    if (multipleOf <= 0) {
        throw new Error("The value of multipleOf MUST be a number, strictly greater than 0.");
    }
    return decoratorSchemaFactory_1.decoratorSchemaFactory(schema => {
        schema.mapper.multipleOf = multipleOf;
    });
}
exports.MultipleOf = MultipleOf;
//# sourceMappingURL=multipleOf.js.map