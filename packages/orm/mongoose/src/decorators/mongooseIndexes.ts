import {schemaOptions} from "../utils/schemaOptions.js";

/**
 * Calls schema.index() to define multiple indexes (most likely compound) for the schema.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * @MongooseIndexes([{fields: {first: 1, second: 1}, options:{unique: 1}}, {fields: {first: 1, third: 1}, options:{unique: 1}}])
 * export class EventModel {
 *
 *   @Property()
 *   first: string;
 *
 *   @Property()
 *   second: string;
 *
 *   @Property()
 *   third: string;
 *
 * }
 * ```
 *
 * @param indexes - define multiple mongoose indexes
 * @returns {Function}
 * @decorator
 * @mongoose
 * @class
 */
export function MongooseIndexes(indexes: Array<{fields: object; options?: any}>): Function {
  return (target: any) => {
    schemaOptions(target, {indexes});
  };
}
