import {PropertyMetadata} from "../../jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../jsonschema/registries/PropertyRegistry";

/**
 * If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.
 *
 * ## Example
 *
 * ```typescript
 * class Model {
 *    @UniqueItems()  // default true
 *    property: number[];
 * }
 * ```
 *
 * @param {boolean} uniqueItems
 * @returns {Function}
 * @constructor
 */
export function UniqueItems(uniqueItems: boolean = true) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.uniqueItems = uniqueItems;
    });
}