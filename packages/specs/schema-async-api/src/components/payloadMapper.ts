import {setValue} from "@tsed/core";
import {
  execMapper,
  isParameterType,
  JsonMethodPath,
  JsonMethodStore,
  JsonOperation,
  JsonParameter,
  JsonParameterTypes,
  JsonSchemaOptions,
  registerJsonSchemaMapper,
  SpecTypes
} from "@tsed/schema";
import {pascalCase} from "change-case";

import {makeOf} from "../utils/somethingOf.js";

function getParameters(jsonOperation: JsonOperation, options: JsonSchemaOptions): JsonParameter[] {
  return jsonOperation.get("parameters").filter((parameter: JsonParameter) => isParameterType(parameter.get("in")));
}

export function payloadMapper(jsonOperationStore: JsonMethodStore, operationPath: JsonMethodPath, options: JsonSchemaOptions) {
  const parameters = getParameters(jsonOperationStore.operation, options);
  const payloadName = pascalCase([operationPath.path, operationPath.method, "Payload"].join(" "));

  setValue(options, `components.schemas.${payloadName}`, {});

  const allOf = parameters
    .map((parameter) => {
      const jsonSchema = execMapper("item", [parameter.schema()], {
        ...options,
        groups: parameter.schema().getGroups(),
        groupsName: parameter.schema().groupsName()
      });

      switch (parameter.get("in")) {
        case JsonParameterTypes.BODY:
          return jsonSchema;
        case JsonParameterTypes.QUERY:
        case JsonParameterTypes.PATH:
        case JsonParameterTypes.HEADER:
          return {
            type: "object",
            properties: {
              [parameter.get("name")]: jsonSchema
            }
          };
      }

      return jsonSchema;
    }, {})
    .filter(Boolean);

  return makeOf("allOf", allOf);
}

registerJsonSchemaMapper("payload", payloadMapper, SpecTypes.ASYNCAPI);
