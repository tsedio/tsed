import {setValue} from "@tsed/core";
import {pascalCase} from "change-case";
import {JsonMethodStore} from "../../domain/JsonMethodStore";
import {JsonMethodPath} from "../../domain/JsonOperation";
import {SpecTypes} from "../../domain/SpecTypes";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {makeOf} from "../../utils/somethingOf";

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
