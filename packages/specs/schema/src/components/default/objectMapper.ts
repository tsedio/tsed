import {deepMerge, isArray} from "@tsed/core";

import {JsonSchema} from "../../domain/JsonSchema.js";
import {alterIgnore} from "../../hooks/alterIgnore.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

function alterMerge(_: string, obj: any) {
  if (obj?.type && obj?.$ref) {
    const keys = Object.keys(obj);

    if (keys.length === 2) {
      return {
        $ref: obj.$ref
      };
    }

    const {$ref, ...schema} = obj;

    obj = {
      allOf: [
        {
          $ref
        },
        schema
      ]
    };
  }

  return obj;
}

/**
 * Serialize Any object to a json schema
 * @param input
 * @param options
 * @ignore
 */
export function objectMapper(input: any, options: JsonSchemaOptions) {
  const {specType, operationIdFormatter, root, components, genericTypes, nestedGenerics, useAlias, genericLabels, ...ctx} = options;

  return Object.entries(input).reduce<any>(
    (obj, [property, value]: [string, any | JsonSchema]) => {
      if (options.withIgnoredProps !== false && !alterIgnore(value, ctx)) {
        if (isArray(value)) {
          console.log(input);
          obj[property] = value.reverse().reduce((schema, value) => {
            const opts = {
              ...options,
              groups: input?.$forwardGroups || value?.$forwardGroups ? options.groups : undefined
            };

            const nextSchema = execMapper("nullable", [execMapper("item", [value], opts), value], opts);

            return deepMerge(schema, nextSchema, {alter: alterMerge});
          }, {});

          obj[property] = alterMerge(undefined, obj[property]);
        } else {
          const opts = {
            ...options,
            groups: input?.$forwardGroups || value?.$forwardGroups ? options.groups : undefined
          };

          obj[property] = execMapper("nullable", [execMapper("item", [value], opts), value], opts);
        }
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

registerJsonSchemaMapper("object", objectMapper);
