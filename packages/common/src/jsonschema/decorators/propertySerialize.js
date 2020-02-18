"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const property_1 = require("./property");
/**
 * Call the function after property serialization.
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
function PropertySerialize(fn) {
    return property_1.PropertyFn((propertyMetadata) => {
        propertyMetadata.onSerialize = fn;
    });
}
exports.PropertySerialize = PropertySerialize;
//# sourceMappingURL=propertySerialize.js.map