import {StoreMerge, useDecorators} from "@tsed/core";
import {Description, Example, Property} from "@tsed/schema";
import {Schema as MongooseSchema} from "mongoose";
import {MONGOOSE_SCHEMA} from "../constants/constants";

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
export function DynamicRef(refPath: string): PropertyDecorator {
  return useDecorators(
    Property(String),
    Example("5ce7ad3028890bd71749d477"),
    Description("Mongoose Ref ObjectId"),
    StoreMerge(MONGOOSE_SCHEMA, {
      type: MongooseSchema.Types.ObjectId,
      refPath
    })
  ) as PropertyDecorator;
}

export type DynamicRef<T> = T | string;
