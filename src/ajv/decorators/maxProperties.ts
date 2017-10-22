import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 * An object instance is valid against `maxProperties` if its number of properties is less than, or equal to, the value of this keyword.
 *
 * !> The value of this keyword MUST be a non-negative integer.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @MaxProperty(10)
 *    property: string[];
 * }
 * ```
 *
 * @param {number} maxProperties
 * @returns {Function}
 * @decorator
 */
export function MaxProperties(maxProperties: number) {
    if (maxProperties < 0) {
        throw new Error("The value of maxProperties MUST be a non-negative integer.");
    }
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.maxProperties = maxProperties;
    });
}