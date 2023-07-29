import {cleanObject} from "@tsed/core";
import {OS3Schema} from "@tsed/openspec";
import type {JSONSchema6} from "json-schema";
import {JsonParameter} from "../domain/JsonParameter";
import {isParameterType, JsonParameterTypes} from "../domain/JsonParameterTypes";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";
import {popGenerics} from "../utils/generics";
import {createRefName} from "../utils/ref";

export type JsonParameterOptions = JsonSchemaOptions & {
  jsonParameter: JsonParameter;
  jsonSchema: JSONSchema6;
  oldSchemas: Record<string, OS3Schema>;
};

function inQueryMapper(parameter: any, {jsonSchema, jsonParameters, ...options}: JsonParameterOptions) {
  if (jsonSchema.$ref) {
    if (!parameter.name) {
      return inlineReference(parameter, options);
    }

    parameter.style = "deepObject";
  }

  parameter.schema = jsonSchema;

  return parameter;
}

function inFileMapper(parameter: any, {jsonSchema}: JsonParameterOptions) {
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

function inlineReference(parameter: any, {jsonParameter, ...options}: JsonSchemaOptions) {
  const name = createRefName(jsonParameter.$schema.getName(), options);
  const schema = options.schemas?.[name];

  if (schema && !options.oldSchemas?.[name]) {
    delete options.schemas![jsonParameter.$schema.getName()];
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

function mapOptions(parameter: JsonParameter, options: JsonSchemaOptions = {}) {
  return {
    ...options,
    groups: parameter.groups,
    groupsName: parameter.groupsName
  };
}

export function parameterMapper(jsonParameter: JsonParameter, opts?: JsonSchemaOptions) {
  if (!isParameterType(jsonParameter.get("in"))) {
    return null;
  }

  const options = mapOptions(jsonParameter, opts);
  const schemas = {...(options.schemas || {})};

  const {type, schema, ...parameter} = execMapper("map", jsonParameter, options);

  const jsonSchema = execMapper("item", jsonParameter.$schema, {
    ...options,
    ...popGenerics(jsonParameter)
  });

  parameter.required = parameter.required || jsonParameter.get("in") === JsonParameterTypes.PATH;

  const paramOpts = {
    ...options,
    jsonSchema,
    jsonParameter,
    oldSchemas: schemas
  };

  switch (jsonParameter.get("in")) {
    case JsonParameterTypes.FILES:
      return inFileMapper(parameter, paramOpts);
    case JsonParameterTypes.QUERY:
      return inQueryMapper(parameter, paramOpts);
    default:
      parameter.schema = jsonSchema;

      return parameter;
  }
}

registerJsonSchemaMapper("parameter", parameterMapper);
