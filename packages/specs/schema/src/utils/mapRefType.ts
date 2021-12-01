import {JsonSchema, JsonSchemaOptions} from "..";

export function mapRefType(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  if (schema.$isRef && obj.oneOf && options.groups !== false) {
    return {...obj, oneOf: schema?.$hooks?.alter("populatedGroups", obj.oneOf, [options.groups])};
  }
  return obj;
}
