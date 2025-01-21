import {MongooseSchema} from "./schema.js";

/**
 * Tell Mongoose to make the property trimmable.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Trim()
 *   name: string;
 * }
 * ```
 *
 * @decorator
 * @mongoose
 * @property
 */
export function Trim(): PropertyDecorator {
  return MongooseSchema({trim: true});
}
