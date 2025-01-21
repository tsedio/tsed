import {MongooseSchema} from "./schema.js";

/**
 * If truthy, Mongoose will add a custom setter that uppercases this string using JavaScript's built-in String#toUpperCase().
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Uppercase()
 *   field: string;
 * }
 * ```
 *
 * @param {boolean} uppercase If truthy, Mongoose will add a custom setter that uppercases this string using JavaScript's built-in String#toUpperCase().
 * @decorator
 * @mongoose
 * @property
 */
export function Uppercase(uppercase: boolean = true): PropertyDecorator {
  return MongooseSchema({uppercase} as any);
}
