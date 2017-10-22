import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 * The value `maxItems` MUST be a non-negative integer.
 *
 * An array instance is valid against `maxItems` if its size is less than, or equal to, the value of this keyword.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    @MaxItems(10)
 *    property: string[];
 * }
 * ```
 *
 * @param {number} maxItems
 * @returns {Function}
 * @decorator
 */
export function MaxItems(maxItems: number) {

    if (maxItems < 0) {
        throw new Error("The value of maxItems MUST be a non-negative integer.");
    }

    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.maxItems = maxItems;
    });
}