import {MongooseSchema} from "./schema.js";

/**
 * If true, uses Mongoose's default _id settings. Only allowed for ObjectIds
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @ExcludeIndexes()
 *   field: string;
 * }
 * ```
 *
 * @param {boolean} auto
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Auto(auto: boolean = true): PropertyDecorator {
  return MongooseSchema({auto} as any);
}
