import {Type} from "../../core/interfaces";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * Set the type of the array items.
 *
 * ```typescript
 * class Model {
 *    @PropertyType(String)
 *    property: string[];
 * }
 * ```
 *
 * @param {Type<any>} type
 * @returns {Function}
 * @decorators
 */
export function PropertyType(type: Type<any>) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.type = type;
    });
}