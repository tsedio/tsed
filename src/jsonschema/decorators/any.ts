import {JSONSchema6TypeName} from "json-schema";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * Set the type of the array items.
 *
 * ```typescript
 * class Model {
 *    @Any()
 *    // eq. @AllowTypes("any")
 *    property: any;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @param types
 */
export function Any(...types: JSONSchema6TypeName[]) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.type = "any";
    });
}