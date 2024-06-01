import {MongooseSchema} from "./schema.js";

/**
 * If [truthy](https://masteringjs.io/tutorials/fundamentals/truthy), Mongoose will
 * disallow changes to this path once the document is saved to the database for the first time. Read more
 * about [immutability in Mongoose here](http://thecodebarbarian.com/whats-new-in-mongoose-5-6-immutable-properties.html).
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Immutable()
 *   field: string;
 * }
 * ```
 *
 * @param {boolean | any} immutable
 * @returns {Function}
 * @decorator
 * @mongoose
 * @property
 */
export function Immutable(immutable: boolean | ((this: any, doc: any) => boolean) = true): PropertyDecorator {
  return MongooseSchema({immutable} as any);
}
