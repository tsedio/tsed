import {JsonSchemaObject} from "../Types.js";

/**
 * Expands a description string into a formatted JSDoc block suitable for emitted code.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const expandJsdocs = (jsdocs: string): string => {
  const lines = jsdocs.split("\n");
  const result = lines.length === 1 ? lines[0] : `\n${lines.map((x) => `* ${x}`).join("\n")}\n`;

  return `/**${result}*/\n`;
};

/**
 * Adds inline JSDoc to a parsed snippet when the source schema exposes a description.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const addJsdocs = (schema: JsonSchemaObject, parsed: string): string => {
  const description = schema.description as string;
  if (!description) {
    return parsed;
  }

  return `\n${expandJsdocs(description)}${parsed}`;
};
