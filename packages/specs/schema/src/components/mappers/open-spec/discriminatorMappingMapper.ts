import {SpecTypes} from "../../../domain/SpecTypes.js";
import {defineSchemaMapper} from "../../../registries/JsonSchemaMapperContainer.js";
import {discriminatorMappingMapper} from "../default/discriminatorMappingMapper.js";

defineSchemaMapper({
  type: "discriminatorMapping",
  transform: discriminatorMappingMapper,
  spec: [SpecTypes.OPENAPI, SpecTypes.SWAGGER, SpecTypes.ASYNCAPI]
});
