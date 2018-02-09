import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * Create an alias of the propertyKey that must be used by the converter.
 *
 * ?> This decorator is used by the Converters to deserialize correctly you model.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    property: string[];
 * }
 * ```
 *
 * @param {string} name
 * @returns {Function}
 * @decorator
 * @converters
 */
export function PropertyName(name: string) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.name = name;
    });
}