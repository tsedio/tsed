import {Store} from "@tsed/core";
import {Schema} from "mongoose";
import {PropertyMetadata, PropertyRegistry} from "@tsed/common";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants";

export type Ref<T> = T | string;

/**
 * Define a property as mongoose reference to other Model (decorated with @Model).
 *
 * ### Example
 *
 * ```typescript
 *
 * @Model()
 * class FooModel {
 *
 *    @Ref(Foo2Model)
 *    field: Ref<Foo2Model>
 *
 *    @Ref(Foo2Model)
 *    list: Ref<Foo2Model>[]
 * }
 *
 * @Model()
 * class Foo2Model {
 * }
 * ```
 *
 * @param type
 * @returns {Function}
 * @decorator
 * @mongoose
 */
export function Ref(type: any) {
    return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
        propertyMetadata.type = type;
        propertyMetadata.store.merge(MONGOOSE_SCHEMA, {
            type: Schema.Types.ObjectId,
            ref: Store.from(type).get(MONGOOSE_MODEL_NAME)
        });
    });
}
