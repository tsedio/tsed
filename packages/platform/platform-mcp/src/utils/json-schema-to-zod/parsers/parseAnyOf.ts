import {JsonSchema, JsonSchemaObject, Refs} from "../Types.js";
import {parseSchema} from "./parseSchema.js";

/**
 * Parses an `anyOf` node into a Zod union across all nested schemas.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseAnyOf = (schema: JsonSchemaObject & {anyOf: JsonSchema[]}, refs: Refs) => {
  return schema.anyOf.length
    ? schema.anyOf.length === 1
      ? parseSchema(schema.anyOf[0], {
          ...refs,
          path: [...refs.path, "anyOf", 0]
        })
      : `z.union([${schema.anyOf.map((schema, i) => parseSchema(schema, {...refs, path: [...refs.path, "anyOf", i]})).join(", ")}])`
    : `z.any()`;
};
