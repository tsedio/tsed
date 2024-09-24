import {isArrowFn, isCollection, isObject, isObjectID, isString, StoreMerge, Type, useDecorators} from "@tsed/core";
import {deserialize, OnDeserialize, OnSerialize, serialize} from "@tsed/json-mapper";
import {ForwardGroups, JsonEntityFn, lazyRef, matchGroups, OneOf, Property, string} from "@tsed/schema";
import {Schema as MongooseSchema} from "mongoose";

import {MONGOOSE_SCHEMA} from "../constants/constants.js";
import {MongooseSchemaTypes} from "../interfaces/MongooseSchemaTypes.js";
import {MongooseModels} from "../registries/MongooseModels.js";

interface RefOptions {
  type?: MongooseSchemaTypes;
  populatedGroups?: string[];
}

function isRef(value: undefined | string | any) {
  return isObjectID(value) || isString(value);
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
  if (!model) {
    throw new Error(
      "A model is required on `@Ref(model)` decorator. Please give a model or wrap it inside an arrow function if you have a circular reference."
    );
  }

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

      if (isCollection(value) && isRef(value[0])) {
        return value.map(String);
      }

      return deserialize(value, {type: getType(), useAlias: false});
    }),
    OnSerialize((value: any, ctx) => {
      if (isRef(value)) {
        return value.toString();
      }

      if (isCollection(value) && isRef(value[0])) {
        return value.map(String);
      }

      const type = getType();

      return serialize(value, {...ctx, type});
    }),
    OneOf(string().example("5ce7ad3028890bd71749d477").description("A reference ObjectID"), lazyRef(getType)),
    populatedGroups.length && PopulateGroups(populatedGroups)
  ) as PropertyDecorator;
}

export type Ref<T> = T | string;
