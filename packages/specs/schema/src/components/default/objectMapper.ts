import {isArray} from "@tsed/core";

import {VendorKeys} from "../../constants/VendorKeys.js";
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
  const {specType, operationIdFormatter, root, components, useAlias, ...ctx} = options;

  return Object.entries(input).reduce<any>(
    (obj, [key, value]: [string, any | JsonSchema]) => {
      if (options.withIgnoredProps !== false && !alterIgnore(value, ctx)) {
        const opts = {
          ...options,
          parent: value,
          groups: input?.get?.(VendorKeys.FORWARD_GROUPS) || value?.get?.(VendorKeys.FORWARD_GROUPS) ? options.groups : undefined
        };

        obj[key] = execMapper("item", [value], opts);
        obj[key] = execMapper("nullable", [obj[key], value], opts);

        if (value.isGeneric && obj[key]?.type) {
          delete obj[key].type;
        }
      }

      return obj;
    },
    isArray(input) ? [] : {}
  );
}

registerJsonSchemaMapper("object", objectMapper);
