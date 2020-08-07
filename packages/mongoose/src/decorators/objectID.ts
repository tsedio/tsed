import {Description, Example, Name} from "@tsed/common";
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
 * @schema
 */
export function ObjectID(name?: string) {
  return applyDecorators(
    name && Name(name),
    Description("Mongoose ObjectId"),
    Example("5ce7ad3028890bd71749d477")
  );
}
