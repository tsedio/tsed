import {SpecTypes} from "../../domain/SpecTypes.js";
import {registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {discriminatorMappingMapper} from "../default/discriminatorMappingMapper.js";

registerJsonSchemaMapper("discriminatorMapping", discriminatorMappingMapper, SpecTypes.OPENAPI);
registerJsonSchemaMapper("discriminatorMapping", discriminatorMappingMapper, SpecTypes.SWAGGER);
registerJsonSchemaMapper("discriminatorMapping", discriminatorMappingMapper, SpecTypes.ASYNCAPI);
