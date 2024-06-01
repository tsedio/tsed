import {MongooseSchema} from "./schema.js";

/**
 * If truthy, Mongoose will add a custom setter that lowercases this string using JavaScript's built-in String#toLowerCase().
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Lowercase()
 *   field: string;
 * }
 * ```
 *
 * @param {boolean} lowercase
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Lowercase(lowercase: boolean = true): PropertyDecorator {
  return MongooseSchema({lowercase} as any);
}
