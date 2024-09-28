import {cleanObject} from "@tsed/core";
import {OS3Example} from "@tsed/openspec";

import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {createRefName} from "../../utils/ref.js";
import type {JsonParameterOptions} from "./operationInParameterMapper.js";

function buildExamples(property: string, examples?: Record<string, OS3Example>) {
  if (!examples) {
    return undefined;
  }

  let hasKey = false;

  const newExamples = Object.entries(examples).reduce((acc, [key, {value, description, ...props}]) => {
    if (value[property] === undefined) {
      return acc;
    }

    hasKey = true;

    return {
      ...acc,
      [key]: {
        ...props,
        value: value[property],
        description
      }
    };
  }, {});

  return hasKey ? newExamples : undefined;
}

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
        style: prop.$ref ? "deepObject" : undefined,
        examples: buildExamples(key, parameter.examples)
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
