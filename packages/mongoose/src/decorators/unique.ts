import {Schema} from "./schema";

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
 * @param {boolean | any} unique
 * @returns {Function}
 * @decorator
 * @mongoose
 */
export function Unique(unique: boolean | any = true) {
  return Schema({unique});
}
