import {JsonSchemaObject} from "../Types.js";

/**
 * Parses boolean schemas into `z.boolean()`.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseBoolean = (_schema: JsonSchemaObject & {type: "boolean"}) => {
  return "z.boolean()";
};
