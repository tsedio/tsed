import {MongooseSchema} from "./schema.js";

/**
 * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose
 * will build a text index on this path.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Text()
 *   field: string;
 * }
 * ```
 *
 * @param {boolean | number | any} text
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Text(text: boolean | number | any = true): PropertyDecorator {
  return MongooseSchema({text} as any);
}
