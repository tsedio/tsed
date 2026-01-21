import {JsonSchema} from "@tsed/schema";
import {z, type ZodObject} from "zod";

import {jsonSchemaToZod} from "./json-schema-to-zod/index.js";

function transform(schema: JsonSchema): ZodObject {
  return eval(`(z) => ${jsonSchemaToZod(schema.toJSON(), {zodVersion: 4})}`)(z);
}

/**
 * Converts a {@link JsonSchema} produced by Ts.ED into an executable Zod validation object.
 *
 * @param schema JsonSchema instance or a pre-built Zod schema.
 * @returns A Zod object when conversion is possible, otherwise the original schema.
 * @module platform/mcp
 * @since 8.17.0
 */
export function toZod(schema: unknown): ZodObject | undefined {
  return schema && schema instanceof JsonSchema ? transform(schema) : (schema as ZodObject | undefined);
}
