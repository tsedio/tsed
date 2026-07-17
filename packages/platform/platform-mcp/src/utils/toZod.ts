import {JsonSchema, JsonSchemaOptions, s} from "@tsed/schema";
import {z, type ZodObject} from "zod";
import {jsonSchemaToZod} from "json-schema-to-zod";

function transform(schema: JsonSchema, opts?: JsonSchemaOptions): ZodObject {
  const schemaFactory = new Function("z", `return ${jsonSchemaToZod(s.compile(schema, {inlineRefs: true, ...opts}), {zodVersion: 4})}`) as (
    zod: unknown
  ) => ZodObject;

  return schemaFactory(z);
}

/**
 * Converts a {@link JsonSchema} produced by Ts.ED into an executable Zod validation object.
 *
 * @param schema JsonSchema instance or a pre-built Zod schema.
 * @param opts
 * @returns A Zod object when conversion is possible, otherwise the original schema.
 * @module platform/mcp
 * @since 8.17.0
 */
export function toZod(schema: unknown, opts?: JsonSchemaOptions): ZodObject | undefined {
  return schema && schema instanceof JsonSchema ? transform(schema, opts) : (schema as ZodObject | undefined);
}
