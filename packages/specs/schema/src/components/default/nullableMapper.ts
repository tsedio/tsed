import {cleanObject} from "@tsed/core/utils/cleanObject.js";
import {uniq} from "@tsed/core/utils/uniq.js";

import {MANY_OF_PROPERTIES} from "../../constants/jsonSchemaProperties.js";
import type {JsonSchema} from "../../domain/JsonSchema.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

export function nullableMapper(obj: any, schema: JsonSchema | null) {
  if (!schema?.isNullable || obj.discriminator) {
    return obj;
  }

  if (obj.$ref) {
    return cleanObject({
      ...obj,
      $ref: undefined,
      oneOf: [
        // Note: anyOf work but isn't correct, oneOf can cause issue if the object shape match with 2 or more schema with the lax constraint
        {type: "null"},
        {
          $ref: obj.$ref
        }
      ]
    });
  }

  if (obj.type === "array") {
    return {
      oneOf: [{type: "null"}, obj]
    };
  }

  if (obj["oneOf"] || obj["anyOf"] || obj["allOf"]) {
    MANY_OF_PROPERTIES.some((keyword: string) => {
      if (obj[keyword]) {
        obj[keyword] = obj[keyword].filter((item: any) => item.type !== "null");

        if (obj[keyword].length === 1) {
          const base = obj[keyword];

          obj = cleanObject({
            ...obj,
            ...base[0],
            [keyword]: undefined,
            type: ["null", Number.isInteger(obj.multipleOf) ? "integer" : base[0].type]
          });
        } else {
          obj[keyword] = [{type: "null"}].concat(obj[keyword]).map((item: any) => {
            if (Number.isInteger(item.multipleOf)) {
              item.type = "integer";
            }
            return item;
          });
          delete obj.type;
        }
      }
    });

    return obj;
  }

  if (obj.type) {
    obj.type = uniq(([] as string[]).concat("null", obj.type));
  }

  return obj;
}

registerJsonSchemaMapper("nullable", nullableMapper);
