import {isArray, isBoolean, isNumber, isObject, isString} from "@tsed/core";
import type {JSONSchema6} from "json-schema";
import {filter} from "rxjs";

import {
  ARRAY_PROPERTIES,
  BOOLEAN_PROPERTIES,
  COMMON_PROPERTIES,
  MANY_OF_PROPERTIES,
  NUMBER_PROPERTIES,
  OBJECT_PROPERTIES,
  STRING_PROPERTIES
} from "../constants/jsonSchemaProperties.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

function findManyOf(obj: any) {
  return MANY_OF_PROPERTIES.find((keyword) => obj[keyword]);
}

const RULES: {[index: string]: {properties: string[]; is: (value: any) => boolean}} = {
  string: {properties: STRING_PROPERTIES, is: isString},
  number: {properties: NUMBER_PROPERTIES, is: isNumber},
  boolean: {properties: BOOLEAN_PROPERTIES, is: isBoolean},
  array: {properties: ARRAY_PROPERTIES, is: () => false},
  object: {properties: OBJECT_PROPERTIES, is: () => false}
};

function pickProperties(type: string, obj: JSONSchema6 & Record<string, never>, item: Record<string, never>) {
  const rule = RULES[type];

  rule?.properties.concat(COMMON_PROPERTIES).forEach((keyword) => {
    if (obj[keyword] !== undefined) {
      if (COMMON_PROPERTIES.includes(keyword)) {
        item[keyword] = (obj[keyword] as never[]).filter(rule.is) as never;
      } else {
        item[keyword] = obj[keyword] as never;
        delete obj[keyword];
      }
    }
  });
}

export function alterOneOf(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  const kind = findManyOf(obj);

  if (kind) {
    obj[kind].forEach((item: {type: string} & Record<string, never>) => {
      pickProperties(item.type as string, obj, item);
    });

    MANY_OF_PROPERTIES.forEach((keyword) => {
      if (obj[keyword] && options.groups !== false && schema.$hooks.has(keyword)) {
        obj = {...obj, [keyword]: schema.$hooks.alter(keyword, obj[keyword], [options.groups])};
      }
    });

    delete obj.const;
    delete obj.enum;

    if (!(obj.items || obj.properties)) {
      delete obj.type;
    }
  }

  return obj;
}
