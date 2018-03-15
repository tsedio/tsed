import {SchemaTypeOpts} from "mongoose";
import {Schema} from "./schema";

/**
 * Tells Mongoose whether to define an index for the property.
 * ### Example
 *
 * ```typescript
 * @Model()
 * export class EventModel {
 *   @Indexed()
 *   field: string;
 * }
 * ```
 *
 * @returns {Function}
 * @decorator
 * @mongoose
 */
export function Indexed(index: SchemaTypeOpts.IndexOpts | boolean | string = true) {
    return Schema({index});
}