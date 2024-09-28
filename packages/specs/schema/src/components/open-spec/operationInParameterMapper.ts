import {OS3Schema} from "@tsed/openspec";
import {camelCase} from "change-case";
import type {JSONSchema6} from "json-schema";

import {JsonParameter} from "../../domain/JsonParameter.js";
import {JsonParameterTypes} from "../../domain/JsonParameterTypes.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, hasMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {popGenerics} from "../../utils/generics.js";

export type JsonParameterOptions = JsonSchemaOptions & {
  jsonParameter: JsonParameter;
  jsonSchema: JSONSchema6;
  oldSchemas: Record<string, OS3Schema>;
};

function mapOptions(parameter: JsonParameter, options: JsonSchemaOptions = {}) {
  return {
    ...options,
    groups: parameter.groups,
    groupsName: parameter.groupsName
  };
}

export function operationInParameterMapper(jsonParameter: JsonParameter, opts?: JsonSchemaOptions) {
  const options = mapOptions(jsonParameter, opts);
  const schemas = {...(options.components?.schemas || {})};

  const {type, schema, ...parameter} = execMapper("map", [jsonParameter], options);

  const jsonSchema = execMapper("item", [jsonParameter.$schema], {
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

  const mapperName = camelCase(`operationIn ${jsonParameter.get("in")}`);

  if (hasMapper(mapperName)) {
    return execMapper(mapperName, [parameter], paramOpts);
  }

  parameter.schema = jsonSchema;

  return parameter;
}

registerJsonSchemaMapper("operationInParameter", operationInParameterMapper);
