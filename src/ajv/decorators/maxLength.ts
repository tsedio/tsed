import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).
 *
 * !> The value of `maxLength` MUST be a non-negative integer.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @MaxLength(10)
 *    property: string;
 * }
 * ```
 *
 * @param {number} maxLength
 * @returns {Function}
 * @decorator
 */
export function MaxLength(maxLength: number) {

    if (maxLength < 0) {
        throw new Error("The value of maxLength MUST be a non-negative integer.");
    }

    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.type = String;
        propertyMetadata.schema.maxLength = maxLength;
    });
}