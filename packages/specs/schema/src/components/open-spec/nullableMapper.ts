import {cleanObject} from "@tsed/core";

import type {JsonSchema} from "../../domain/JsonSchema.js";
import {SpecTypes} from "../../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {nullableMapper} from "../default/nullableMapper.js";

export function nullableMapperOpenApi(obj: any, schema: JsonSchema | null, options: JsonSchemaOptions) {
  if (!schema?.isNullable) {
    return obj;
  }

  if (options.specVersion === "3.1.0") {
    return nullableMapper(obj, schema);
  }

  if (obj.$ref) {
    return cleanObject({
      ...obj,
      nullable: true
    });
  }

  function map(manyOf: string) {
    return obj[manyOf]?.length === 1
      ? cleanObject({
          ...obj[manyOf][0],
          [manyOf]: undefined,
          type: Number.isInteger(obj.multipleOf) ? "integer" : obj[manyOf][0]?.type
        })
      : cleanObject({
          type: obj[manyOf]?.length > 1 ? undefined : obj.type,
          [manyOf]: obj[manyOf]?.map((item: any) => {
            if (Number.isInteger(item.multipleOf)) {
              item.type = "integer";
            }

            return item;
          })
        });
  }

  return cleanObject({
    ...obj,
    ...map("oneOf"),
    ...map("anyOf"),
    nullable: true
  });
}

registerJsonSchemaMapper("nullable", nullableMapperOpenApi, SpecTypes.OPENAPI);
registerJsonSchemaMapper("nullable", nullableMapperOpenApi, SpecTypes.SWAGGER);
