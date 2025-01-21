import {MongooseSchema} from "./schema.js";

/**
 * Tell Mongoose to set default select() behavior for this path.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Select()
 *   field: string;
 * }
 * ```
 *
 * @param {boolean | any} select If `true`, Mongoose will add the select property to this path. If `select` is an object, Mongoose will apply the select property to this path with the given options.
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Select(select: boolean | any = true): PropertyDecorator {
  return MongooseSchema({select});
}
