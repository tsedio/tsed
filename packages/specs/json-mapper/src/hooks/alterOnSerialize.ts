import {JsonHookContext, JsonSchema} from "@tsed/schema";

/**
 * Execute the `onSerialize` hooks registered on a schema before emitting a value.
 * Used internally by the serializer when a property exposes lifecycle hooks.
 */
export function alterOnSerialize(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onSerialize", value, [options]);
}
