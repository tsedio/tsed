import {StoreMerge, useDecorators} from "@tsed/core";
import {Name, Property} from "@tsed/schema";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseVirtualRefOptions} from "../interfaces/MongooseVirtualRefOptions";

function mapOptions(options: string | MongooseVirtualRefOptions, propertyKey: string, foreignField: string | undefined) {
  let schema: any, type: any;

  if (typeof options === "object") {
    type = options.type;

    schema = {
      ref: type,
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

  return {schema, type};
}

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
export function VirtualRef(type: string, foreignField: string): PropertyDecorator;
export function VirtualRef(options: MongooseVirtualRefOptions): PropertyDecorator;
export function VirtualRef(options: string | MongooseVirtualRefOptions, foreignField?: string): PropertyDecorator;
export function VirtualRef(options: string | MongooseVirtualRefOptions, foreignField?: string): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    const {schema, type} = mapOptions(options, propertyKey, foreignField);

    return useDecorators(Property(type), Name(schema.localField), StoreMerge(MONGOOSE_SCHEMA, schema))(target, propertyKey);
  };
}

export type VirtualRef<T> = T | null;
export type VirtualRefs<T> = T[];
