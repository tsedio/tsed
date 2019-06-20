import {Property, Schema} from "@tsed/common";
import {applyDecorators, Store, StoreFn, StoreMerge} from "@tsed/core";
import {Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_MODEL_NAME, MONGOOSE_SCHEMA} from "../constants";
import {MongooseSchemaTypes} from "../interfaces/MongooseSchemaTypes";

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
 * @param model
 * @param type
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Ref(model: string | any, type: MongooseSchemaTypes = MongooseSchemaTypes.OBJECT_ID) {
  return applyDecorators(
    Property({use: String}),
    Schema({
      type: String,
      example: "5ce7ad3028890bd71749d477",
      description: "Mongoose Ref ObjectId"
    }),
    StoreFn((store: Store) => {
      delete store.get("schema").$ref;
    }),
    StoreMerge(MONGOOSE_SCHEMA, {
      type: MongooseSchema.Types[type],
      ref: typeof model === "string" ? model : Store.from(model).get(MONGOOSE_MODEL_NAME)
    })
  );
}
