import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 * An object instance is valid against `minProperties` if its number of properties is greater than, or equal to, the value of this keyword.
 *
 * !> The value of this keyword MUST be a non-negative integer.
 *
 * ?> Omitting this keyword has the same behavior as a value of 0.
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @MinProperty(10)
 *    property: string[];
 * }
 * ```
 *
 * @param {number} minProperties
 * @returns {Function}
 * @decorator
 */
export function MinProperties(minProperties: number) {
    if (minProperties < 0) {
        throw new Error("The value of minProperties MUST be a non-negative integer.");
    }
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.minProperties = minProperties;
    });
}