import {SchemaTypeOpts} from "mongoose";
import {MongooseSchema} from "./schema";

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
export function Indexed(index: SchemaTypeOpts.IndexOpts | boolean | string = true) {
  return MongooseSchema({index});
}
