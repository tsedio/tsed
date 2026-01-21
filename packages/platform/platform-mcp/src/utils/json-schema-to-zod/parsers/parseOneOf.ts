import {JsonSchema, JsonSchemaObject, Refs} from "../Types.js";
import {parseSchema} from "./parseSchema.js";

/**
 * Parses `oneOf` schemas by generating super refinements that ensure exactly one child schema matches.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseOneOf = (schema: JsonSchemaObject & {oneOf: JsonSchema[]}, refs: Refs) => {
  return schema.oneOf.length
    ? schema.oneOf.length === 1
      ? parseSchema(schema.oneOf[0], {
          ...refs,
          path: [...refs.path, "oneOf", 0]
        })
      : `z.any().superRefine((x, ctx) => {
    const schemas = [${schema.oneOf
      .map((schema, i) =>
        parseSchema(schema, {
          ...refs,
          path: [...refs.path, "oneOf", i]
        })
      )
      .join(", ")}];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  })`
    : "z.any()";
};
