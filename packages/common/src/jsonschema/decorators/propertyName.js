"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_1 = require("./property");
/**
 * Create an alias of the propertyKey that must be used by the converter.
 *
 * ::: tip
 * This decorator is used by the Converters to deserialize correctly you model.
 * :::
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    property: string[];
 * }
 * ```
 *
 * @param {string} name
 * @returns {Function}
 * @decorator
 * @converters
 * @jsonschema
 * @property
 */
function PropertyName(name) {
    return property_1.PropertyFn((propertyMetadata) => {
        propertyMetadata.name = name;
    });
}
exports.PropertyName = PropertyName;
//# sourceMappingURL=propertyName.js.map