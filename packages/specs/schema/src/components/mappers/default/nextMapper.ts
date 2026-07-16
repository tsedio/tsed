import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";
import {JsonSchema} from "../../../domain/JsonSchema.js";
import type {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {type Type} from "@tsed/core";
import {getGenericsOptions} from "../../../utils/generics.js";
import {mergeSchema} from "../../../utils/mergeSchema.js";

function getMapper(input: JsonSchema, mapper: string, root?: boolean) {
  if (input.isClass && !input.isLocalSchema && !root) {
    return mapper || "class";
  }

  return "any";
}

function buildAndMergeSchemas(mapper: string, schema1: JsonSchema, schema2: JsonSchema, options: JsonSchemaOptions) {
  const schema = execMapper(getMapper(schema2, mapper, options.root), [schema2], {
    ...options,
    root: false,
    mapper: mapper === "next" ? options.mapper : undefined
  });

  let extraSchema = execMapper(options.root ? "any" : mapper, [schema1], {
    ...options,
    root: false,
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

export function nextMapper(input: JsonSchema | Type | any, options: JsonSchemaOptions) {
  if (input && input instanceof JsonSchema && !input.isLocalSchema) {
    const refSchema = input.getRefSchema();

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
    root: false,
    mapper: undefined
  });
}

defineSchemaMapper({type: "item", transform: itemMapper});
defineSchemaMapper({type: "next", transform: nextMapper});
defineSchemaMapper({type: "properties", transform: nextMapper});
defineSchemaMapper({type: "items", transform: nextMapper});
defineSchemaMapper({type: "additionalProperties", transform: nextMapper});
defineSchemaMapper({type: "propertyNames", transform: nextMapper});
defineSchemaMapper({type: "contains", transform: nextMapper});
defineSchemaMapper({type: "dependencies", transform: nextMapper});
defineSchemaMapper({type: "patternProperties", transform: nextMapper});
defineSchemaMapper({type: "additionalItems", transform: nextMapper});
defineSchemaMapper({type: "not", transform: nextMapper});
defineSchemaMapper({type: "definitions", transform: nextMapper});
