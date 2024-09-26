import {getStatusMessage} from "../../constants/httpStatusMessages.js";
import type {JsonOperation} from "../../domain/JsonOperation.js";
import type {JsonParameter} from "../../domain/JsonParameter.js";
import {isParameterType, JsonParameterTypes} from "../../domain/JsonParameterTypes.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

function extractParameters(jsonOperation: JsonOperation, options: JsonSchemaOptions) {
  return jsonOperation
    .get("parameters")
    .filter((parameter: JsonParameter) => isParameterType(parameter.get("in")))
    .reduce(
      (inputs: [any[], JsonParameter[]], parameter: JsonParameter) => {
        const [parameters, bodyParameters] = inputs;

        if ([JsonParameterTypes.BODY, JsonParameterTypes.FILES].includes(parameter.get("in"))) {
          return [parameters, [...bodyParameters, parameter]];
        }

        return [[...parameters, parameter], bodyParameters];
      },
      [[], []]
    );
}

export function operationMapper(jsonOperation: JsonOperation, {tags = [], defaultTags = [], ...options}: JsonSchemaOptions = {}) {
  const {consumes, produces, ...operation} = execMapper("map", [jsonOperation], {...options, ignore: ["parameters"]});

  if (operation.security) {
    operation.security = [].concat(operation.security);
  }

  if (jsonOperation.get("responses").size === 0) {
    operation.responses = {
      "200": {
        description: getStatusMessage(200)
      }
    };
  }

  const parametersOptions = {
    ...options,
    consumes: jsonOperation.get("consumes")?.length ? jsonOperation.get("consumes") : ["application/json"]
  };

  const [parameters, bodyParameters] = extractParameters(jsonOperation, parametersOptions);

  operation.parameters = execMapper("operationInParameters", [parameters], options);

  if (bodyParameters.length) {
    operation.requestBody = execMapper("operationRequestBody", [bodyParameters], parametersOptions);
  }

  const operationTags = operation.tags?.length ? operation.tags : defaultTags;

  if (operationTags.length) {
    operation.tags = operationTags.map(({name}: any) => name);
  }

  tags.push(...operationTags);

  return operation;
}

registerJsonSchemaMapper("operation", operationMapper);
