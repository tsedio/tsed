"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_1 = require("./property");
/**
 * Call the function before property is deserialization.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyDeserialize(v => v + 1)
 *    property: string;
 * }
 * ```
 *
 * @param {Function} fn
 * @returns {Function}
 * @decorator
 * @converters
 * @jsonschema
 * @property
 */
function PropertyDeserialize(fn) {
    return property_1.PropertyFn((propertyMetadata) => {
        propertyMetadata.onDeserialize = fn;
    });
}
exports.PropertyDeserialize = PropertyDeserialize;
//# sourceMappingURL=propertyDeserialize.js.map