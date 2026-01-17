import {JsonHookContext, JsonSchema} from "@tsed/schema";

/**
 * Execute the `onDeserialize` hooks registered on a schema before writing the value onto the target.
 */
export function alterOnDeserialize(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onDeserialize", value, [options]);
}
