import {MongooseSchema} from "./schema.js";

/**
 * If true, Mongoose will skip gathering indexes on subpaths. Only allowed for subdocuments and subdocument arrays.
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
 * @param {boolean} excludeIndexes
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function ExcludeIndexes(excludeIndexes: boolean = true): PropertyDecorator {
  return MongooseSchema({excludeIndexes} as any);
}
