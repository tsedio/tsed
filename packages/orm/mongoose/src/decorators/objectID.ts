import {useDecorators} from "@tsed/core";
import {Description, Example, Name, Pattern} from "@tsed/schema";
import {Types} from "mongoose";

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
  return useDecorators(name && Name(name), Pattern(/^[0-9a-fA-F]{24}$/), Description("An ObjectID"), Example("5ce7ad3028890bd71749d477"));
}

export type ObjectID = Types.ObjectId;
