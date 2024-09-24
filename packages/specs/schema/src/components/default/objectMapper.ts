import {isArray} from "@tsed/core";

import {JsonSchema} from "../../domain/JsonSchema.js";
import {alterIgnore} from "../../hooks/alterIgnore.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

/**
 * Serialize Any object to a json schema
 * @param input
 * @param options
 * @ignore
 */
export function objectMapper(input: any, options: JsonSchemaOptions) {
  const {specType, operationIdFormatter, root, components, genericTypes, nestedGenerics, useAlias, genericLabels, ...ctx} = options;

  return Object.entries(input).reduce<any>(
    (obj, [key, value]: [string, any | JsonSchema]) => {
      if (options.withIgnoredProps !== false && !alterIgnore(value, ctx)) {
        const opts = {
          ...options,
          groups: input?.$forwardGroups || value?.$forwardGroups ? options.groups : undefined
        };

        // remove groups to avoid bad schema generation over children models
        obj[key] = execMapper("item", [value], opts);
        obj[key] = execMapper("nullable", [obj[key], value], opts);
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

registerJsonSchemaMapper("object", objectMapper);
