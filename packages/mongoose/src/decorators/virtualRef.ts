import {Property} from "@tsed/common";
import {applyDecorators, Store, StoreMerge} from "@tsed/core";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants";
import {MongooseVirtualRefOptions} from "../interfaces/MongooseVirtualRefOptions";

export type VirtualRef<T> = T | null;
export type VirtualRefs<T> = T[];

/**
 * Define a property as mongoose virtual reference to other Model (decorated with @Model).
 *
 * ::: warning
 * To avoid circular dependencies, do not use the virtual reference model in
 * anything except a type declaration. Using the virtual reference model will prevent
 * typescript transpiler from stripping away the import statement and cause a circular
 * import in node.
 * :::
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
 * @param foreignField
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function VirtualRef(type: string, foreignField: string): Function;
export function VirtualRef(options: MongooseVirtualRefOptions): Function;
export function VirtualRef(options: string | MongooseVirtualRefOptions, foreignField?: string): Function;

export function VirtualRef(options: string | MongooseVirtualRefOptions, foreignField?: string): Function {
  return (target: any, propertyKey: string, descriptor: any) => {
    let schema: any, type: any;
    if (typeof options === "object") {
      type = options.type;
      schema = {
        ref: typeof type === "string" ? type : Store.from(type).get(MONGOOSE_MODEL_NAME),
        localField: options.localField || propertyKey,
        foreignField: options.foreignField,
        justOne: options.justOne || false,
        options: options.options
      };
    } else {
      schema = {
        ref: options,
        localField: propertyKey,
        foreignField
      };
    }

    return applyDecorators(Property({name: schema.localField, use: type}), StoreMerge(MONGOOSE_SCHEMA, schema))(
      target,
      propertyKey,
      descriptor
    );
  };
}
