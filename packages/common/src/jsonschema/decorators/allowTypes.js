"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decoratorSchemaFactory_1 = require("../utils/decoratorSchemaFactory");
/**
 * Set the type of the array items.
 *
 * ## Example
 * ### With multiple types
 *
 * ```typescript
 * class Model {
 *    @AllowTypes("string", "number", "boolean", "array")
 *    property: "string" | "number" | "boolean" | "array";
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
 *       "type": ["string", "number", "boolean", "array"]
 *     }
 *   }
 * }
 * ```
 *
 * ### With array of multiple types
 *
 * ```typescript
 * class Model {
 *    @AllowTypes("string", "number", "boolean", "array")
 *    property: ("string" | "number" | "boolean" | "array")[];
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
 *          "type": ["string", "number", "boolean", "array"]
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * @returns {Function}
 * @param type
 * @param types
 * @decorator
 * @property
 * @jsonschema
 * @auto-map The data will be stored on the right place according to the type and collectionType (primitive or collection).
 */
function AllowTypes(type, ...types) {
    return decoratorSchemaFactory_1.decoratorSchemaFactory((schema) => {
        schema.mapper.type = [type].concat(types);
    });
}
exports.AllowTypes = AllowTypes;
//# sourceMappingURL=allowTypes.js.map