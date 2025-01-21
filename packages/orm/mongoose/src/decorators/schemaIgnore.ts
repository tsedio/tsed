import {MongooseSchema} from "./schema.js";

/**
 * Exclude this property from the mongoose schema.
 *
 * ### Example
 *
 * ```typescript
 * @Model()
 * @SchemaIgnore()
 * @Property()
 * kind: string;
 * ```
 *
 * @decorator
 * @mongoose
 * @class
 */

export function SchemaIgnore(): PropertyDecorator {
  return MongooseSchema({schemaIgnore: true} as any);
}
