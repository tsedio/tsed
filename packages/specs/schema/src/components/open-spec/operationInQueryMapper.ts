import {cleanObject} from "@tsed/core";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {createRefName} from "../../utils/ref";
import type {JsonParameterOptions} from "./operationInParameterMapper";

function inlineReference(parameter: any, {jsonParameter, ...options}: JsonSchemaOptions) {
  const name = createRefName(jsonParameter.$schema.getName(), options);
  const schema = options.components?.schemas?.[name];

  if (schema && !options.oldSchemas?.[name]) {
    delete options.components!.schemas![jsonParameter.$schema.getName()];
  }

  return Object.entries(schema?.properties || {}).reduce((params, [key, {description, ...prop}]: [string, any]) => {
    return [
      ...params,
      cleanObject({
        ...parameter,
        name: key,
        required: (schema?.required || []).includes(key),
        description,
        schema: prop,
        style: prop.$ref ? "deepObject" : undefined
      })
    ];
  }, []);
}

export function operationInQueryMapper(parameter: any, {jsonSchema, jsonParameters, ...options}: JsonParameterOptions) {
  if (jsonSchema.$ref) {
    if (!parameter.name) {
      return inlineReference(parameter, options);
    }

    parameter.style = "deepObject";
  }

  parameter.schema = jsonSchema;

  return parameter;
}

registerJsonSchemaMapper("operationInQuery", operationInQueryMapper);
