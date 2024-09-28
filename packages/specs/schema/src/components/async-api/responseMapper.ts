import {setValue} from "@tsed/core";
import {pascalCase} from "change-case";

import {JsonMethodStore} from "../../domain/JsonMethodStore.js";
import {JsonMethodPath} from "../../domain/JsonOperation.js";
import {SpecTypes} from "../../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {makeOf} from "../../utils/somethingOf.js";

export function responsePayloadMapper(jsonOperationStore: JsonMethodStore, operationPath: JsonMethodPath, options: JsonSchemaOptions) {
  const responses = jsonOperationStore.operation.getResponses();
  const statuses: number[] = [];
  const statusesTexts: string[] = [];
  const successSchemes: unknown[] = [];
  const errorSchemes: unknown[] = [];

  [...responses.entries()].forEach(([status, jsonResponse]) => {
    const response = execMapper("map", [jsonResponse], options);

    statuses.push(+status);

    statusesTexts.push(response.description);

    if (+status !== 204) {
      const {content} = response;
      const schema = content[Object.keys(content)[0]];

      if (+status >= 200 && +status < 400) {
        successSchemes.push(schema);
      } else {
        successSchemes.push(schema);
      }
    }
  });

  const responsePayloadName = pascalCase([operationPath.path, operationPath.method, "Response"].join(" "));
  const responsePayload = {
    type: "object",
    properties: {
      status: {
        type: "number",
        enum: statuses
      },
      statusText: {
        type: "string",
        enum: statusesTexts
      }
    },
    required: ["status"]
  };

  const dataSchema = makeOf("oneOf", successSchemes);

  if (dataSchema) {
    setValue(responsePayload, "properties.data", dataSchema);
  }

  const errorSchema = makeOf("oneOf", errorSchemes);

  if (errorSchemes.length) {
    setValue(responsePayload, "properties.error", errorSchema);
  }

  setValue(options, `components.schemas.${responsePayloadName}`, responsePayload);

  return {$ref: `#/components/schemas/${responsePayloadName}`};
}

registerJsonSchemaMapper("response", responsePayloadMapper, SpecTypes.ASYNCAPI);
