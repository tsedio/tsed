import {uniq} from "@tsed/core";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import type {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

function hasNullable(obj: any) {
  return obj.oneOf.find((o: any) => o.type === "null");
}

export function mapNullableType(obj: any, schema: JsonSchema | null, options: JsonSchemaOptions) {
  if (!schema?.isNullable) {
    return obj;
  }
  let types: string[] = [].concat(obj.type).filter(Boolean);

  switch (options.specType) {
    default:
    case SpecTypes.JSON:
      if (!obj.discriminator) {
        if (obj.oneOf) {
          if (!hasNullable(obj)) {
            obj.oneOf.unshift({
              type: "null"
            });
          }
        } else {
          obj.type = uniq(["null", ...types]);
        }
      }
      break;

    case SpecTypes.OPENAPI:
      obj.nullable = true;

      if (!obj.oneOf) {
        if (types.length > 1) {
          obj.oneOf = types.map((type) => ({type}));
          delete obj.type;
        } else {
          obj.type = types[0];
        }
      }
      break;
  }

  return obj;
}
