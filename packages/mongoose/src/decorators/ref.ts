import {isArrowFn, isString, StoreMerge, Type, useDecorators} from "@tsed/core";
import {OnDeserialize, OnSerialize, serialize} from "@tsed/json-mapper";
import {JsonEntityFn, JsonEntityStore, Property, string} from "@tsed/schema";
import {Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchemaTypes} from "../interfaces/MongooseSchemaTypes";
import {MongooseModels} from "../registries/MongooseModels";

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
 * @param model
 * @param type
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Ref(model: string | (() => Type) | any, type: MongooseSchemaTypes = MongooseSchemaTypes.OBJECT_ID): PropertyDecorator {
  const getType = () => (isString(model) ? MongooseModels.get(model) : isArrowFn(model) ? model() : model);

  return useDecorators(
    Property(Object),
    StoreMerge(MONGOOSE_SCHEMA, {
      type: MongooseSchema.Types[type],
      ref: model
    }),
    OnDeserialize((value) => {
      if (value._bsontype || isString(value)) {
        return value.toString();
      }

      return value;
    }),
    OnSerialize((value: any, ctx) => {
      if (value._bsontype || isString(value)) {
        return value.toString();
      }
      const type = getType();

      return serialize(value, {...ctx, type});
    }),
    JsonEntityFn((store) => {
      const type = getType();

      store.itemSchema.oneOf([
        string().example("5ce7ad3028890bd71749d477").description("Mongoose Ref ObjectId"),
        JsonEntityStore.from(type).schema as any
      ]);

      store.type = Object;
    })
  ) as PropertyDecorator;
}

export type Ref<T> = T | string;
