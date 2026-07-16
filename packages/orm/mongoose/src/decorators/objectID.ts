import {Description, Example, Name, Pattern} from "@tsed/schema";
import {Auto} from "./auto.js";
import {OnDeserialize} from "@tsed/json-mapper";
import {Schema} from "./schema.js";
import {Types} from "mongoose";
import {useDecorators} from "@tsed/core";

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
  return useDecorators(
    name && Name(name),
    Pattern(/^[0-9a-fA-F]{24}$/),
    Description("An ObjectID"),
    Example("5ce7ad3028890bd71749d477"),
    Auto(),
    Schema({
      type: Types.ObjectId,
      match: undefined
    })
  );
}

export type ObjectID = Types.ObjectId;
