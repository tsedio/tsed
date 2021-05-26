import {cleanObject} from "@tsed/core";
import type {JsonSchema} from "../domain/JsonSchema";
import {SpecTypes} from "../domain/SpecTypes";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";

export function mapNullableType(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  if (!schema.nullable) {
    return obj;
  }

  let types: string[] = [].concat(obj.type).filter((type: string) => type !== "null");

  switch (options.specType) {
    case SpecTypes.SWAGGER:
    case SpecTypes.JSON:
      obj.type = ["null", ...types];
      break;

    case SpecTypes.OPENAPI:
      if (types.length > 1) {
        obj.oneOf = types.map((type: string) => {
          return cleanObject({type, nullable: true});
        }, []);
      } else {
        obj.type = types[0];
        obj.nullable = true;
      }
  }

  return obj;
}
