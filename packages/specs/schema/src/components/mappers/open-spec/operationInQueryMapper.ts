import {createRefName, getSchemaFromRef} from "../../../utils/ref.js";
import type {JsonParameter} from "../../../domain/JsonParameter.js";
import type {JsonParameterOptions} from "./operationInParameterMapper.js";
import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {OS3Example} from "@tsed/openspec";
import {cleanObject} from "@tsed/core";
import {defineSchemaMapper} from "../../../registries/JsonSchemaMapperContainer.js";

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

// an object model: a reference that isn't an enum, or a generic model (allOf with such a reference)
function isObjectReference(schema: any, options: JsonSchemaOptions): boolean {
  if (schema.$ref) {
    return !getSchemaFromRef(schema.$ref, options)?.enum;
  }

  return !!schema.allOf?.some((item: any) => isObjectReference(item, options));
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
    const style = parameter.style || (isObjectReference(prop, options) ? "deepObject" : undefined);

    params.push(
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
    );

    return params;
  }, [] as any[]);
}

export function operationInQueryMapper(parameter: any, {jsonSchema, ...options}: JsonParameterOptions) {
  if (jsonSchema.$ref && !parameter.name) {
    return inlineReference(parameter, options);
  }

  // same rule as inlineReference: a given style wins, an enum gets no style, deepObject explodes
  const style = parameter.style || (isObjectReference(jsonSchema, options) ? "deepObject" : undefined);

  if (style === "deepObject") {
    parameter.style = style;
    parameter.explode = true;
  }

  parameter.schema = jsonSchema;

  return parameter;
}

defineSchemaMapper({type: "operationInQuery", transform: operationInQueryMapper});
