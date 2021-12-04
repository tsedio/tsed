import {isArray} from "@tsed/core";
import {JsonSchema} from "../domain/JsonSchema";
import {alterIgnore} from "../hooks/alterIgnore";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";

/**
 * Serialize Any object to a json schema
 * @param input
 * @param options
 * @ignore
 */
export function objectMapper(input: any, options: JsonSchemaOptions) {
  const {specType, operationIdFormatter, root, schemas, genericTypes, nestedGenerics, useAlias, genericLabels, ...ctx} = options;

  return Object.entries(input).reduce<any>(
    (obj, [key, value]: [string, any | JsonSchema]) => {
      if (options.withIgnoredProps !== false && !alterIgnore(value, ctx)) {
        // remove groups to avoid bad schema generation over children models
        obj[key] = execMapper("item", value, {
          ...options,
          groups: input?.$forwardGroups || value?.$forwardGroups ? options.groups : undefined
        });
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

registerJsonSchemaMapper("object", objectMapper);
