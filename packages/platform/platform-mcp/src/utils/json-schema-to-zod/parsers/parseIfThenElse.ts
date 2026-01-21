import {JsonSchema, JsonSchemaObject, Refs} from "../Types.js";
import {parseSchema} from "./parseSchema.js";

/**
 * Parses conditional schemas by generating union refinements that evaluate `if/then/else` logic at runtime.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const parseIfThenElse = (
  schema: JsonSchemaObject & {
    if: JsonSchema;
    then: JsonSchema;
    else: JsonSchema;
  },
  refs: Refs
): string => {
  const $if = parseSchema(schema.if, {...refs, path: [...refs.path, "if"]});
  const $then = parseSchema(schema.then, {
    ...refs,
    path: [...refs.path, "then"]
  });
  const $else = parseSchema(schema.else, {
    ...refs,
    path: [...refs.path, "else"]
  });
  return `z.union([${$then}, ${$else}]).superRefine((value,ctx) => {
  const result = ${$if}.safeParse(value).success
    ? ${$then}.safeParse(value)
    : ${$else}.safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((error) => ctx.addIssue(error))
  }
})`;
};
