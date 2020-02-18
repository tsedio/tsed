"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @UniqueItems()  // default true
 *    property: number[];
 * }
 * ```
 *
 *  * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @UniqueItems()
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
 *       "type": "array",
 *       "uniqueItems": true,
 *       "items": {
 *         "type": "string"
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @param {boolean} uniqueItems
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 * @property
 */
function UniqueItems(uniqueItems = true) {
    return decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        schema.uniqueItems = uniqueItems;
    });
}
exports.UniqueItems = UniqueItems;
//# sourceMappingURL=uniqueItems.js.map