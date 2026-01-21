import {JsonSchema, JsonSchemaObject, Refs} from "../Types.js";
import {parseSchema} from "./parseSchema.js";

/**
 * Parses the `not` keyword into a refinement that fails when the nested schema succeeds.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseNot = (schema: JsonSchemaObject & {not: JsonSchema}, refs: Refs) => {
  return `z.any().refine((value) => !${parseSchema(schema.not, {
    ...refs,
    path: [...refs.path, "not"]
  })}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`;
};
