import {fromJsonSchema as fromJSchema} from "@modelcontextprotocol/server";
import {JsonSchema, type JsonSchemaOptions, s} from "@tsed/schema";

/**
 * Converts a Ts.ED schema into the MCP SDK v2 Standard Schema adapter.
 *
 * @param schema Ts.ED or plain JSON Schema document.
 * @param opts Compilation options applied to Ts.ED schemas.
 * @module platform/mcp
 * @since 8.17.0
 */
export function fromJsonSchema<T = unknown>(schema: unknown, opts?: JsonSchemaOptions) {
  if (!schema) {
    return undefined;
  }

  const jsonSchema = schema instanceof JsonSchema ? s.compile(schema, {inlineRefs: true, ...opts}) : schema;

  return fromJSchema<T>(jsonSchema as any);
}
