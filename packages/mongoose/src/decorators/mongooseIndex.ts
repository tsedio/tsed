import {applySchemaOptions} from "../utils/schemaOptions";

/**
 * Calls schema.index() to define an index (most likely compound) for the schema.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * @MongooseIndex({first: 1, second: 1}, {unique: 1})
 * export class EventModel {
 *
 *   @Property()
 *   first: string;
 *
 *   @Property()
 *   second: string;
 *
 * }
 * ```
 *
 * @param fields
 * @param options
 * @returns {Function}
 * @decorator
 * @mongoose
 * @class
 */
export function MongooseIndex(fields: object, options: any): Function {
  return (target: any) => {
    applySchemaOptions(target, {
      indexes: [{fields, options}]
    });
  };
}
