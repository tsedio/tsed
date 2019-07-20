import {Property, Schema} from "@tsed/common";
import {applyDecorators, Store, StoreFn, StoreMerge} from "@tsed/core";
import {Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants";

export type DynamicRef<T> = T | string;
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
 * @param refPath
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function DynamicRef(refPath: string) {
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
      type: MongooseSchema.Types.ObjectId,
      refPath
    })
  );
}
