import {cleanObject} from "@tsed/core";
import {OS3Example} from "@tsed/openspec";

import type {JsonParameter} from "../../domain/JsonParameter.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {createRefName, getSchemaFromRef} from "../../utils/ref.js";
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

function inlineReference(
  parameter: any,
  {
    jsonParameter,
    ...options
  }: JsonSchemaOptions & {
    jsonParameter: JsonParameter;
  }
) {
  const name = createRefName(jsonParameter.schema().itemSchema().getName(), options);
  const schema = options.components?.schemas?.[name];

  if (schema && !options.oldSchemas?.[name]) {
    delete options.components?.schemas?.[jsonParameter.schema().itemSchema().getName()];
  }

  return Object.entries(schema?.properties || {}).reduce((params, [key, {description, ...prop}]: [string, any]) => {
    const style = parameter.style || (prop.$ref && !getSchemaFromRef(prop.$ref, options)?.enum) ? "deepObject" : undefined;

    return [
      ...params,
      cleanObject({
        ...parameter,
        style,
        explode: style === "deepObject" ? true : parameter.explode,
        name: key,
        required: (schema?.required || []).includes(key),
        description,
        schema: prop,
        examples: buildExamples(key, parameter.examples)
      })
    ];
  }, []);
}

export function operationInQueryMapper(parameter: any, {jsonSchema, ...options}: JsonParameterOptions) {
  if (jsonSchema.$ref) {
    if (!parameter.name) {
      return inlineReference(parameter, options);
    }

    const schema = getSchemaFromRef(jsonSchema.$ref, options);
    // if the reference is an enum, we don't need to set the style or explode
    if (!schema?.enum) {
      parameter.style = "deepObject";
      parameter.explode = true;
    }
  }

  parameter.schema = jsonSchema;

  return parameter;
}

registerJsonSchemaMapper("operationInQuery", operationInQueryMapper);
