import {MongooseSchema} from "./schema.js";

/**
 * Tell Mongoose to ensure a unique index is created for this path.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Unique()
 *   index: string;
 * }
 * ```
 *
 * @param {boolean | any} unique If `true`, Mongoose will add the unique property to this path. If `unique` is an object, Mongoose will apply the unique index to this path with the given options.
 * @returns {Function}
 * @decorator
 * @mongoose
 */
export function Unique(unique: boolean | any = true): PropertyDecorator {
  return MongooseSchema({unique});
}
