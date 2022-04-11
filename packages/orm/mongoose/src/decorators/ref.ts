import {isArrowFn, isObject, isString, StoreMerge, Type, useDecorators} from "@tsed/core";
import {OnDeserialize, OnSerialize, serialize} from "@tsed/json-mapper";
import {ForwardGroups, JsonEntityFn, lazyRef, matchGroups, OneOf, Property, string} from "@tsed/schema";
import {Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants/constants";
import {MongooseSchemaTypes} from "../interfaces/MongooseSchemaTypes";
import {MongooseModels} from "../registries/MongooseModels";

interface RefOptions {
  type?: MongooseSchemaTypes;
  populatedGroups?: string[];
}

function isRef(value: undefined | string | any) {
  return (value && value._bsontype) || isString(value);
}

function PopulateGroups(populatedGroups: string[]) {
  return useDecorators(
    ForwardGroups(true),
    JsonEntityFn((store) => {
      store.schema.$hooks.on("oneOf", (obj: any[], givenGroups: string[]) => {
        if (matchGroups(populatedGroups, givenGroups)) {
          return obj.filter((x) => x.type === "string"); // keep the object id;
        } else {
          return obj.filter((x) => x.type !== "string"); // keep the ref definition
        }
      });
    })
  );
}

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
 * @param options
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Ref(
  model: string | (() => Type) | any,
  options: RefOptions | MongooseSchemaTypes = MongooseSchemaTypes.OBJECT_ID
): PropertyDecorator {
  const getType = () => (isString(model) ? MongooseModels.get(model) : isArrowFn(model) ? model() : model);
  const populatedGroups = (isObject(options) && options.populatedGroups) || [];

  return useDecorators(
    Property(Object),
    StoreMerge(MONGOOSE_SCHEMA, {
      type: MongooseSchema.Types[isObject(options) ? options.type || MongooseSchemaTypes.OBJECT_ID : options],
      ref: model
    }),
    OnDeserialize((value) => {
      if (isRef(value)) {
        return value.toString();
      }

      return value;
    }),
    OnSerialize((value: any, ctx) => {
      if (isRef(value)) {
        return value.toString();
      }
      const type = getType();

      return serialize(value, {...ctx, type});
    }),
    OneOf(string().example("5ce7ad3028890bd71749d477").description("Mongoose Ref ObjectId"), lazyRef(getType)),
    populatedGroups.length && PopulateGroups(populatedGroups)
  ) as PropertyDecorator;
}

export type Ref<T> = T | string;
