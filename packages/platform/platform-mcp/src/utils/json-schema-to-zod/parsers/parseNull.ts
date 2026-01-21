import {JsonSchemaObject} from "../Types.js";

/**
 * Parses `type: null` nodes into `z.null()`.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseNull = (_schema: JsonSchemaObject & {type: "null"}) => {
  return "z.null()";
};
