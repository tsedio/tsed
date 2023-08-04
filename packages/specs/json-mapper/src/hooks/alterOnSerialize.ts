import {JsonHookContext, JsonSchema} from "@tsed/schema";

export function alterOnSerialize(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onSerialize", value, [options]);
}
