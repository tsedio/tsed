import {PropertyMetadata, PropertyRegistry} from "@tsed/common";
import {SchemaTypeOpts} from "mongoose";

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