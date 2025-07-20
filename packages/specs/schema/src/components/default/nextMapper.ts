import {type Type} from "@tsed/core";

import {JsonSchema} from "../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {getGenericsOptions} from "../../utils/generics.js";
import {mergeSchema} from "../../utils/mergeSchema.js";

function getMapper(input: JsonSchema, mapper: string) {
  return input && input.isClass ? mapper || "class" : "any";
}

function buildAndMergeSchemas(mapper: string, schema1: JsonSchema, schema2: JsonSchema, options: JsonSchemaOptions) {
  let schema = execMapper(getMapper(schema2, mapper), [schema2], {
    ...options,
    mapper: mapper === "next" ? options.mapper : undefined
  });

  let extraSchema = execMapper(mapper, [schema1], {
    ...options,
    generics: undefined,
    mapper: mapper === "next" ? options.mapper : undefined
  });

  if ((schema.$ref || schema.allOf) && extraSchema.type && Object.keys(extraSchema).length === 1) {
    extraSchema = {};
  }

  if (schema1.canRef) {
    const name = extraSchema.$ref.split("/").pop();
    const titleSchema = options.components!.schemas[name];

    options.components!.schemas[name] = mergeSchema(schema, titleSchema);

    return extraSchema;
  }

  return mergeSchema(schema, extraSchema);
}

export function itemMapper(input: JsonSchema | Type, options: JsonSchemaOptions) {
  if (input && input instanceof JsonSchema) {
    if (!input.isCollection && input?.itemSchema?.()) {
      const {generics, mapper} = getGenericsOptions(input, options);
      const schema1 = input;
      const schema2 = input.itemSchema();

      return buildAndMergeSchemas("next", schema1, schema2, {...options, generics, mapper});
    }
  }

  return execMapper("next", [input], options);
}

export function nextMapper(input: JsonSchema | Type | any, options: JsonSchemaOptions, parent: JsonSchema) {
  if (input && input instanceof JsonSchema && input.isClass) {
    const refSchema = input.refSchema();

    if (refSchema) {
      let {generics, mapper} = getGenericsOptions(input, options);
      mapper = getMapper(input, mapper);

      return buildAndMergeSchemas(mapper, input, refSchema, {
        ...options,
        generics
      });
    }
  }

  return execMapper(getMapper(input, options.mapper), [input], {
    ...options,
    mapper: undefined
  });
}

registerJsonSchemaMapper("item", itemMapper);
registerJsonSchemaMapper("next", nextMapper);
registerJsonSchemaMapper("properties", nextMapper);
registerJsonSchemaMapper("items", nextMapper);
registerJsonSchemaMapper("additionalProperties", nextMapper);
registerJsonSchemaMapper("propertyNames", nextMapper);
registerJsonSchemaMapper("contains", nextMapper);
registerJsonSchemaMapper("dependencies", nextMapper);
registerJsonSchemaMapper("patternProperties", nextMapper);
registerJsonSchemaMapper("additionalItems", nextMapper);
registerJsonSchemaMapper("not", nextMapper);
registerJsonSchemaMapper("definitions", nextMapper);
