import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";


/**
 * The enumArray keyword is used to restrict array of enums to a predefined set of values.
 * It must be an array with at least one element, where each element is unique.
 *
 * Elements in the array might be of any value, including null.
 *
 * ## Example
 *
 * enum ModuleType {
 *   SINGLE =  'SINGLE', DOUBLE =  'DOUBLE'
 * }
 *
 * ```typescript
 * class Model {
 *    @EnumArray(ModuleType.SINGLE, ModuleType.DOUBLE)
 *    moduleType: ModuleType;
 * }
 * ```
 *
 * @param {string | number | boolean | {}} enumValue
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 */
export function EnumArray(...enumValue: Array<string | number | boolean | {}>) {

    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.type = "array";
        propertyMetadata.schema.items = {enum: [...enumValue]};
    });
}
