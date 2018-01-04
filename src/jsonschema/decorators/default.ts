import {PropertyMetadata} from "../class/PropertyMetadata";
import {PropertyRegistry} from "../registries/PropertyRegistry";

/**
 * There are no restrictions placed on the value of this keyword.
 *
 * This keyword can be used to supply a default JSON value associated with a particular schema.
 * It is RECOMMENDED that a default value be valid against the associated schema.
 *
 * @param {string | number | boolean | {}} defaultValue
 * @returns {Function}
 * @decorator
 * @ajv
 * @jsonschema
 */
export function Default(defaultValue: string | number | boolean | {}) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.schema.default = defaultValue;
    });
}