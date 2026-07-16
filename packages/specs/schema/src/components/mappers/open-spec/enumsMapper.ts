import {JsonSchema, SpecTypes} from "../../../domain/index.js";
import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {defineSchemaMapper} from "../../../registries/JsonSchemaMapperContainer.js";
import {enumsMapper} from "../default/enumsMapper.js";

export function wrapEnumsMapper(obj: any, schema: JsonSchema, options: JsonSchemaOptions) {
  obj = enumsMapper(obj, schema, options);

  if (obj.const !== undefined) {
    obj.enum = [obj.const];
    delete obj.const;
  }

  return obj;
}

defineSchemaMapper({type: "enums", transform: wrapEnumsMapper, spec: [SpecTypes.OPENAPI, SpecTypes.SWAGGER, SpecTypes.ASYNCAPI]});
