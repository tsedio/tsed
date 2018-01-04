import {JSONSchema6TypeName} from "json-schema";
import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * Set the type of the array items.
 *
 * ```typescript
 * class Model {
 *    @AllowTypes("string", "integer", "boolean", "array")
 *    property: string[];
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @param type
 * @param types
 */
export function AllowTypes(type: JSONSchema6TypeName, ...types: JSONSchema6TypeName[]) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.type = [type].concat(types);
    });
}