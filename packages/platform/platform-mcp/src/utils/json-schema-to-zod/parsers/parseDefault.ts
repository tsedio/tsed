import {JsonSchemaObject} from "../Types.js";

/**
 * Fallback parser that maps unknown structures to `z.any()`.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseDefault = (_schema: JsonSchemaObject) => {
  return "z.any()";
};
