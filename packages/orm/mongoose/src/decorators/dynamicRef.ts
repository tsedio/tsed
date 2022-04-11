import {classOf, isArrowFn, isString, StoreMerge, Type, useDecorators} from "@tsed/core";
import {Description, Example, JsonHookContext, OneOf, Property, string} from "@tsed/schema";
import {Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants/constants";
import {deserialize, OnDeserialize, OnSerialize, serialize} from "@tsed/json-mapper";
import {MongooseModels} from "../registries/MongooseModels";

function isRef(value: undefined | string | any) {
  return (value && value._bsontype) || isString(value);
}

function getType(refPath: string, ctx: JsonHookContext) {
  return (ctx?.self[refPath] && MongooseModels.get(ctx.self[refPath] as string)) || Object;
}

/**
 * Define a property as mongoose reference to other Model (decorated with @Model).
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * class FooModel {
 *
 *    @DynamicRef('type')
 *    field: DynamicRef<OtherFooModel | OtherModel>
 *
 *    @Enum(['OtherFooModel', 'OtherModel'])
 *    type: string
 * }
 *
 * @Model()
 * class OtherFooModel {
 * }
 *
 * @Model()
 * class OtherModel {
 * }
 * ```
 *
 * @param refPath {String} the path to apply the correct model
 * @param types {Type} the classes to generate the correct json schema
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function DynamicRef(refPath: string, ...types: Type<any>[]): PropertyDecorator {
  return useDecorators(
    Property(Object),
    Example("5ce7ad3028890bd71749d477"),
    Description("Mongoose Ref ObjectId"),
    StoreMerge(MONGOOSE_SCHEMA, {
      type: MongooseSchema.Types.ObjectId,
      refPath
    }),
    OnDeserialize((value, ctx) => {
      if (isRef(value)) {
        return value.toString();
      }

      return deserialize(value, {...ctx, type: getType(refPath, ctx)});
    }),
    OnSerialize((value: any, ctx) => {
      if (isRef(value)) {
        return value.toString();
      }

      return serialize(value, {...ctx, type: getType(refPath, ctx)});
    }),
    OneOf(string().example("5ce7ad3028890bd71749d477").description("Mongoose Ref ObjectId"), ...types)
  ) as PropertyDecorator;
}

export type DynamicRef<T> = T | string;
