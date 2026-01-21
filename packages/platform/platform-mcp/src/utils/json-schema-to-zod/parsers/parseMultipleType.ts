import {JsonSchemaObject, Refs} from "../Types.js";
import {parseSchema} from "./parseSchema.js";

/**
 * Parses schemas whose `type` keyword is an array, creating a union of each primitive variant.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseMultipleType = (schema: JsonSchemaObject & {type: string[]}, refs: Refs) => {
  return `z.union([${schema.type.map((type) => parseSchema({...schema, type} as any, {...refs, withoutDefaults: true})).join(", ")}])`;
};
