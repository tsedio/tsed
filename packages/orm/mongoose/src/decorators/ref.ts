import {isArrowFn, isString, StoreMerge, Type, useDecorators} from "@tsed/core";
import {OnDeserialize, OnSerialize, serialize} from "@tsed/json-mapper";
import {ForwardGroups, JsonEntityFn, lazyRef, matchGroups, Property, string} from "@tsed/schema";
import {Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchemaTypes} from "../interfaces/MongooseSchemaTypes";
import {MongooseModels} from "../registries/MongooseModels";

interface RefOptions {
  type?: MongooseSchemaTypes;
  populatedGroups?: string[];
}

function isRef(value: undefined | string | any) {
  return (value && value._bsontype) || isString(value);
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
 * @param type
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
  const hasPopulatedGroups = typeof options === "object" && options.populatedGroups !== undefined;

  return useDecorators(
    Property(Object),
    StoreMerge(MONGOOSE_SCHEMA, {
      type: MongooseSchema.Types[typeof options === "object" ? options.type || MongooseSchemaTypes.OBJECT_ID : options],
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
    JsonEntityFn(async (store) => {
      store.itemSchema.oneOf([string().example("5ce7ad3028890bd71749d477").description("Mongoose Ref ObjectId"), lazyRef(getType)]);

      store.type = Object;

      store.itemSchema.$isRef = true;
      if (hasPopulatedGroups) {
        const groups = options.populatedGroups;
        store.schema.$hooks.on("populatedGroups", (obj: any[], givenGroups: string[]) => {
          if (matchGroups(groups || [], givenGroups)) {
            return obj.filter((x) => x.type === "string"); // keep the object id;
          } else {
            return obj.filter((x) => x.type !== "string"); // keep the ref definition
          }
        });
      }
    }),
    ForwardGroups(hasPopulatedGroups) // or givenGroups is undefined
  ) as PropertyDecorator;
}

export type Ref<T> = T | string;
