import {cleanObject} from "@tsed/core";
import {type} from "node:os";
import {MANY_OF_PROPERTIES} from "../constants/jsonSchemaProperties.js";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

export function mapNullableType(obj: any, schema: JsonSchema | null, options: JsonSchemaOptions) {
  if (!schema?.isNullable) {
    return obj;
  }

  switch (options.specType) {
    default:
    case SpecTypes.JSON:
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
                  type: ["null", base[0].type]
                });
              } else {
                obj[keyword] = [{type: "null"}].concat(obj[keyword]);
                delete obj.type;
              }
            }
          });
        }
      }
      break;

    case SpecTypes.OPENAPI:
      if (obj.$ref) {
        return cleanObject({
          ...obj,
          ...(obj.$ref && {
            anyOf: [
              {
                $ref: obj.$ref
              }
            ],
            type: undefined
          }),
          nullable: true,
          $ref: undefined
        });
      }
      return cleanObject({
        ...obj,
        ...(obj.anyOf?.length === 1
          ? {
              ...obj.anyOf[0],
              anyOf: undefined
            }
          : {
              type: obj.anyOf?.length > 1 ? undefined : obj.type
            }),
        nullable: true
      });
  }

  return obj;
}
