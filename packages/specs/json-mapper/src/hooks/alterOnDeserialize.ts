import {JsonHookContext, JsonSchema} from "@tsed/schema";

export function alterOnDeserialize(schema: JsonSchema, value: any, options: JsonHookContext) {
  return schema.$hooks.alter("onDeserialize", value, [options]);
}
