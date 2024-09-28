import {uniq} from "@tsed/core";

import type {JsonSchema} from "../../domain/JsonSchema.js";
import {alterRequiredGroups} from "../../hooks/alterRequiredGroups.js";
import type {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

function mapRequiredProps(obj: any, schema: JsonSchema, options: JsonSchemaOptions = {}) {
  const {useAlias} = options;
  const props = Object.keys(obj.properties || {});

  return (keys: string[], key: string) => {
    const aliasedKey = useAlias ? (schema.alias.get(key) as string) || key : key;

    if (props.includes(aliasedKey)) {
      return keys.concat(aliasedKey);
    }

    return keys;
  };
}

function extractRequiredProps(obj: any, schema: JsonSchema, options: JsonSchemaOptions): string[] {
  let required: string[] = obj.required || [];

  required = [...required, ...schema.$required];

  if (schema.get("properties")) {
    required = Object.entries(schema.get("properties")).reduce((required, [key, prop]: [string, any]) => {
      if (prop && prop.$selfRequired !== undefined) {
        return prop.$selfRequired ? required.concat(key) : required.filter((k) => k === key);
      }

      return required;
    }, required);
  }

  return alterRequiredGroups(uniq(required), schema, options);
}

export function requiredMapper(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  if (options.groups && options.groups.includes("partial")) {
    if (obj.discriminator) {
      return {
        ...obj,
        required: [obj.discriminator.propertyName]
      };
    }

    return obj;
  }

  let required = extractRequiredProps(obj, schema, options);

  required = uniq(required).reduce(mapRequiredProps(obj, schema, options), []);

  if (obj.discriminator) {
    required.push(obj.discriminator.propertyName);
  }

  if (required.length) {
    return {
      ...obj,
      required
    };
  }

  return obj;
}

registerJsonSchemaMapper("required", requiredMapper);
