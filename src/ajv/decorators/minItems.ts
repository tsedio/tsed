import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 *
 * An array instance is valid against `minItems` if its size is greater than, or equal to, the value of this keyword.
 *
 * !> The value `minItems` MUST be a non-negative integer.
 *
 * ?> Omitting this keyword has the same behavior as a value of 0.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @MinItems(10)
 *    property: string[];
 * }
 * ```
 *
 * @param {number} minItems
 * @returns {Function}
 * @decorator
 */
export function MinItems(minItems: number) {

    if (minItems < 0) {
        throw new Error("The value of minItems MUST be a non-negative integer.");
    }

    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.minItems = minItems;
    });
}