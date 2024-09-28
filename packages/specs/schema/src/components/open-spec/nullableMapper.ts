import {cleanObject} from "@tsed/core";

import type {JsonSchema} from "../../domain/JsonSchema.js";
import {SpecTypes} from "../../domain/SpecTypes.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";

export function nullableMapperOpenApi(obj: any, schema: JsonSchema | null) {
  if (!schema?.isNullable) {
    return obj;
  }

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
          anyOf: undefined,
          type: Number.isInteger(obj.multipleOf) ? "integer" : obj.anyOf[0]?.type
        }
      : {
          type: obj.anyOf?.length > 1 ? undefined : obj.type,
          anyOf: obj.anyOf?.map((item: any) => {
            if (Number.isInteger(item.multipleOf)) {
              item.type = "integer";
            }

            return item;
          })
        }),
    nullable: true
  });
}

registerJsonSchemaMapper("nullable", nullableMapperOpenApi, SpecTypes.OPENAPI);
registerJsonSchemaMapper("nullable", nullableMapperOpenApi, SpecTypes.SWAGGER);
