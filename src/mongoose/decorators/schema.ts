import {SchemaTypeOpts} from "mongoose";
import {PropertyMetadata} from "../../common/jsonschema/class/PropertyMetadata";
import {PropertyRegistry} from "../../common/jsonschema/registries/PropertyRegistry";

/**
 * Attach a schema on property class.
 *
 * @param definition A mongoose schema
 * @returns {Function}
 * @decorator
 * @mongoose
 */
export function Schema(definition: SchemaTypeOpts<any>) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.store.merge("mongooseSchema", definition);
    });
}