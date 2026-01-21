import {JsonSchemaObject} from "../Types.js";

type Opener = string;
type MessagePrefix = string;
type Closer = string;

type Builder = [Opener, Closer] | [Opener, MessagePrefix, Closer];

/**
 * Utility that appends chained Zod calls while preserving custom error messages defined on the JSON Schema node.
 *
 * @param schema Schema containing potential validation keywords.
 * @param key Keyword to inspect (e.g., `minLength`).
 * @param get Builder that returns the string fragments to append.
 * @module platform/mcp
 * @since 8.17.0
 */
export function withMessage(schema: JsonSchemaObject, key: string, get: (props: {value: unknown; json: string}) => Builder | void) {
  const value = schema[key as keyof typeof schema];

  let r = "";

  if (value !== undefined) {
    const got = get({value, json: JSON.stringify(value)});

    if (got) {
      const opener = got[0];
      const prefix = got.length === 3 ? got[1] : "";
      const closer = got.length === 3 ? got[2] : got[1];

      r += opener;

      if (schema.errorMessage?.[key] !== undefined) {
        r += prefix + JSON.stringify(schema.errorMessage[key]);
      }
      r;
      r += closer;
    }
  }

  return r;
}
