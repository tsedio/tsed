import {PropertyMetadata, PropertyRegistry} from "@tsed/common";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseVirtualRefOptions} from "../interfaces/MongooseVirtualRefOptions";

export type VirtualRef<T> = T | null;
export type VirtualRefs<T> = T[];

/**
 * Define a property as mongoose virtual reference to other Model (decorated with @Model).
 *
 * Warning: To avoid circular dependencies, do not use the virtual reference model in
 * anything except a type declaration. Using the virtual reference model will prevent
 * typescript transpiler from stripping away the import statement and cause a circular
 * import in node.
 *
 * ### Example
 *
 * ```typescript
 *
 * @Model()
 * class FooModel {
 *
 *    @VirtualRef("Foo2Model", "foo")
 *    field: VirtualRef<Foo2Model>
 *
 *    @VirtualRef("Foo2Model", "foo")
 *    list: VirtualRefs<Foo2Model>
 * }
 *
 * @Model()
 * class Foo2Model {
 *    @Ref(FooModel)
 *    foo: Ref<FooModel>;
 * }
 * ```
 *
 * @param type
 * @returns {Function}
 * @decorator
 * @mongoose
 */

export function VirtualRef(type: string, foreignField: string): Function;
export function VirtualRef(options: MongooseVirtualRefOptions): Function;

export function VirtualRef(options: string | MongooseVirtualRefOptions, foreignField?: string): Function {
  return PropertyRegistry.decorate((propertyMetadata: PropertyMetadata) => {
    if (typeof options === "object") {
      propertyMetadata.store.merge(MONGOOSE_SCHEMA, {
        ref: options.type,
        localField: options.localField || propertyMetadata.name,
        foreignField: options.foreignField,
        justOne: options.justOne || false,
        options: options.options
      });
    } else {
      propertyMetadata.store.merge(MONGOOSE_SCHEMA, {
        ref: options,
        localField: propertyMetadata.name,
        foreignField
      });
    }
  });
}
