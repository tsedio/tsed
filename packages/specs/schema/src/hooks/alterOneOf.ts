import type {JsonSchema} from "../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

export function alterOneOf(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  if (obj.oneOf && options.groups !== false) {
    obj = {...obj, oneOf: schema.$hooks.alter("oneOf", obj.oneOf, [options.groups])};
  }

  if ((obj.oneOf || obj.allOf || obj.anyOf) && !(obj.items || obj.properties)) {
    delete obj.type;
  }

  return obj;
}
