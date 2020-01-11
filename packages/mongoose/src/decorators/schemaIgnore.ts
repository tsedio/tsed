import {Schema} from "./schema";

/**
 * Do not apply this property to schema (create virtual property)
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * @SchemaIgnore()
 * @Property()
 * kind: string;
 *
 * ```
 *
 * @returns {Function}
 * @decorator
 * @mongoose
 * @class
 */

export function SchemaIgnore(): Function {
  return Schema({schemaIgnore: true});
}
