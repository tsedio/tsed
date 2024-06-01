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
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Trim() {
  return MongooseSchema({trim: true});
}
