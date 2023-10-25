import {setValue} from "@tsed/core";
import {pascalCase} from "change-case";
import {JsonMethodStore} from "../../domain/JsonMethodStore";
import {JsonMethodPath, JsonOperation} from "../../domain/JsonOperation";
import {JsonParameter} from "../../domain/JsonParameter";
import {isParameterType, JsonParameterTypes} from "../../domain/JsonParameterTypes";
import {SpecTypes} from "../../domain/SpecTypes";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {popGenerics} from "../../utils/generics";
import {makeOf} from "../../utils/somethingOf";

function mapOptions(parameter: JsonParameter, options: JsonSchemaOptions = {}) {
  return {
    ...options,
    groups: parameter.groups,
    groupsName: parameter.groupsName
  };
}

function getParameters(jsonOperation: JsonOperation, options: JsonSchemaOptions): JsonParameter[] {
  return jsonOperation.get("parameters").filter((parameter: JsonParameter) => isParameterType(parameter.get("in")));
}

export function payloadMapper(jsonOperationStore: JsonMethodStore, operationPath: JsonMethodPath, options: JsonSchemaOptions) {
  const parameters = getParameters(jsonOperationStore.operation, options);
  const payloadName = pascalCase([operationPath.path, operationPath.method, "Payload"].join(" "));

  setValue(options, `components.schemas.${payloadName}`, {});

  const allOf = parameters
    .map((parameter) => {
      const opts = mapOptions(parameter, options);
      const jsonSchema = execMapper("item", [parameter.$schema], {
        ...opts,
        ...popGenerics(parameter)
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
