import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * The value of `minimum` MUST be a number, representing an inclusive upper limit for a numeric instance.
 *
 * If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to `minimum`.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Minimum(10)
 *    property: number;
 * }
 * ```
 *
 * @param {number} minimum
 * @param {boolean} exclusive
 * @returns {Function}
 * @decorator
 */
export function Minimum(minimum: number, exclusive: boolean = false) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.type = Number;

        if (exclusive) {
            propertyMetadata.schema.exclusiveMinimum = minimum;
        } else {
            propertyMetadata.schema.minimum = minimum;
        }
    });
}