import {IndexOptions} from "mongoose";

import {MongooseSchema} from "./schema.js";

/**
 * Tell Mongoose whether to define an index for the property.
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Indexed()
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Indexed(index: IndexOptions | boolean | string = true): PropertyDecorator {
  return MongooseSchema({index} as any);
}
