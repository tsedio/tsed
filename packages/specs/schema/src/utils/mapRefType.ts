import type {JsonSchema} from "../domain/JsonSchema";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";

export function mapRefType(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  if (schema.$isRef && obj.oneOf && options.groups !== false) {
    return {...obj, oneOf: schema?.$hooks?.alter("populatedGroups", obj.oneOf, [options.groups])};
  }
  return obj;
}
