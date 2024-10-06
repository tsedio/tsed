import {cleanObject} from "@tsed/core";

import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import type {JsonParameterOptions} from "./operationInParameterMapper.js";

export function operationInFilesMapper(parameter: any, {jsonSchema}: JsonParameterOptions) {
  const schema = {
    type: "string",
    format: "binary",
    oneOf: undefined
  };

  if (jsonSchema.type === "array") {
    jsonSchema.items = cleanObject({
      ...(jsonSchema.items as Object),
      ...schema
    });

    parameter.schema = jsonSchema;

    return parameter;
  }

  parameter.schema = cleanObject({
    ...jsonSchema,
    ...schema
  });

  return parameter;
}

registerJsonSchemaMapper("operationInFiles", operationInFilesMapper);
