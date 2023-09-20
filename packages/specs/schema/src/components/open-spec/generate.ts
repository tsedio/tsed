import {getValue, Type, uniqBy} from "@tsed/core";
import {SpecTypes} from "../../domain/SpecTypes";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {SpecSerializerOptions} from "../../utils/getSpec";

function generate(model: Type<any>, options: SpecSerializerOptions) {
  options = {
    ...options,
    specType: SpecTypes.OPENAPI
  };

  const specJson: any = {
    paths: execMapper("paths", [model], options)
  };

  specJson.tags = uniqBy(options.tags, "name");

  if (Object.keys(getValue(options, "components.schemas", {})).length) {
    specJson.components = {
      schemas: options.components!.schemas
    };
  }

  return specJson;
}

registerJsonSchemaMapper("generate", generate, SpecTypes.OPENAPI);
registerJsonSchemaMapper("generate", generate, SpecTypes.SWAGGER);
