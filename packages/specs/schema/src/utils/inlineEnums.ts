import {JsonSchema} from "../domain/JsonSchema";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";

export function inlineEnums(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  if (options.inlineEnums && obj.enum?.isJsonSchema) {
    obj.enum = obj.enum.toJSON().enum;
  }

  return obj;
}
