"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * Set the type of the array items.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Any()
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
 *       "type": ["integer", "number", "string", "boolean", "array", "object", "null"]
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @param types
 * @decorator
 * @property
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
function Any(...types) {
    return decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        schema.mapper.type = ["integer", "number", "string", "boolean", "array", "object", "null"];
    });
}
exports.Any = Any;
//# sourceMappingURL=any.js.map