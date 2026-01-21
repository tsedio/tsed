import {JsonSchemaObject, Refs} from "../Types.js";
import {omit} from "../utils/omit.js";
import {parseSchema} from "./parseSchema.js";

/**
 * Handles OpenAPI-style `nullable` keywords by delegating to the underlying schema and marking it nullable.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseNullable = (schema: JsonSchemaObject & {nullable: true}, refs: Refs) => {
  return `${parseSchema(omit(schema, "nullable"), refs, true)}.nullable()`;
};
