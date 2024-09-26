import type {JsonSchema} from "../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

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
