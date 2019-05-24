import {Property, Schema} from "@tsed/common";
import {applyDecorators} from "@tsed/core";

/**
 * Tell Mongoose whether to define an ObjectId property.
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @ObjectId('id')
 *   _id: string;
 * }
 * ```
 * @param name
 * @decorator
 * @mongoose
 * @property
 */
export function ObjectID(name?: string) {
  return applyDecorators(
    Property({name, use: String}),
    Schema({
      description: "Mongoose ObjectId",
      example: "5ce7ad3028890bd71749d477"
    })
  );
}
