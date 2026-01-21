import {JsonSchemaObject, Serializable} from "../Types.js";

/**
 * Parses constant schemas into `z.literal` expressions.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseConst = (schema: JsonSchemaObject & {const: Serializable}) => {
  return `z.literal(${JSON.stringify(schema.const)})`;
};
