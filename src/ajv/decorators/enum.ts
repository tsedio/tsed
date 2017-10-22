import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 * The enum keyword is used to restrict a value to a fixed set of values.
 * It must be an array with at least one element, where each element is unique.
 *
 * Elements in the array might be of any value, including null.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @Enum("value1", "value2")
 *    property: "value1" | "value2";
 * }
 * ```
 *
 * @param {string | number | boolean | {}} enumValue
 * @returns {Function}
 * @constructor
 */
export function Enum(...enumValue: Array<string | number | boolean | {}>) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.enum = [].concat((propertyMetadata.schema.enum || []) as any, enumValue as any);
    });
}