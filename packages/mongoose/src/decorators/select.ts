import {Schema} from "./schema";

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
 * @param {boolean | any} select
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Select(select: boolean | any = true) {
  return Schema({select});
}
