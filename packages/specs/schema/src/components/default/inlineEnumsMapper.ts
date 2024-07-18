import {JsonSchema} from "../../domain/JsonSchema";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";

export function inlineEnumsMapper(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  if (options.inlineEnums && obj.enum?.$isJsonDocument) {
    obj.enum = obj.enum.toJSON().enum;
  }

  if (obj.enum) {
    obj.type = obj.type === "object" || obj.type === undefined ? "string" : obj.type;
  }

  return obj;
}

registerJsonSchemaMapper("inlineEnums", inlineEnumsMapper);
