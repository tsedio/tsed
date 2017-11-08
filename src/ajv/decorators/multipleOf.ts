import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 * A numeric instance is valid only if division by this keyword's value results in an integer.
 *
 * !> The value of `multipleOf` MUST be a number, strictly greater than 0.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @MultipleOf(10)
 *    property: number;
 * }
 * ```
 *
 * @param {number} multipleOf
 * @returns {Function}
 * @decorator
 */
export function MultipleOf(multipleOf: number) {
    if (multipleOf <= 0) {
        throw new Error("The value of multipleOf MUST be a number, strictly greater than 0.");
    }
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.type = Number;
        propertyMetadata.schema.multipleOf = multipleOf;
    });
}