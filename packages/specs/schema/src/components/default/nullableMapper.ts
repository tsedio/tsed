import {cleanObject} from "@tsed/core";
import {MANY_OF_PROPERTIES} from "../../constants/jsonSchemaProperties";
import type {JsonSchema} from "../../domain/JsonSchema";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";

export function nullableMapper(obj: any, schema: JsonSchema | null) {
  if (!schema?.isNullable) {
    return obj;
  }

  if (!obj.discriminator) {
    if (obj.$ref) {
      obj = cleanObject({
        ...obj,
        $ref: undefined,
        anyOf: [
          {type: "null"},
          {
            $ref: obj.$ref
          }
        ]
      });
    } else {
      MANY_OF_PROPERTIES.some((keyword) => {
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
    }
  }

  return obj;
}

registerJsonSchemaMapper("nullable", nullableMapper);
