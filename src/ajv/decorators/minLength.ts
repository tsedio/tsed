import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 *
 * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.
 *
 * The length of a string instance is defined as the number of its characters as defined by [RFC 7159](http://json-schema.org/latest/json-schema-validation.html#RFC7159).
 *
 * !> The value of minLength MUST be a non-negative integer.
 *
 * ?> Omitting this keyword has the same behavior as a value of 0.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @MinLength(10)
 *    property: string;
 * }
 * ```
 *
 * @param {number} minLength
 * @returns {Function}
 * @decorator
 */
export function MinLength(minLength: number) {

    if (minLength < 0) {
        throw new Error("The value of minLength MUST be a non-negative integer.");
    }

    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.type = String;
        propertyMetadata.schema.minLength = minLength;
    });
}