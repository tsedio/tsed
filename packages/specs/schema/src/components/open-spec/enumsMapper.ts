import {JsonSchema} from "../../domain/JsonSchema.js";
import {SpecTypes} from "../../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {enumsMapper} from "../default/enumsMapper.js";

export function wrapEnumsMapper(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  obj = enumsMapper(obj, schema, options);

  if (obj.const) {
    obj.enum = [obj.const];
    delete obj.const;
  }

  return obj;
}

registerJsonSchemaMapper("enums", wrapEnumsMapper, SpecTypes.OPENAPI);
registerJsonSchemaMapper("enums", wrapEnumsMapper, SpecTypes.SWAGGER);
registerJsonSchemaMapper("enums", wrapEnumsMapper, SpecTypes.ASYNCAPI);
