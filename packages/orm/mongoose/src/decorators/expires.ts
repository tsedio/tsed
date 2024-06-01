import {MongooseSchema} from "./schema.js";

/**
 * Defines a TTL index on this path. Only allowed for dates.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Expires('5d')
 *   field: string;
 * }
 * ```
 *
 * @param {boolean | any} expires
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Expires(expires: number | string | Date): PropertyDecorator {
  return MongooseSchema({expires} as any);
}
