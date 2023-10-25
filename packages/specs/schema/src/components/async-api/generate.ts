import {getValue, Type, uniqBy} from "@tsed/core";
import {SpecTypes} from "../../domain/SpecTypes";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {SpecSerializerOptions} from "../../utils/getSpec";

function generate(model: Type<any>, options: SpecSerializerOptions) {
  const specJson: any = {
    channels: execMapper("channels", [model], options)
  };

  specJson.tags = uniqBy(options.tags, "name");

  if (options.components?.schemas && Object.keys(options.components.schemas).length) {
    specJson.components = {
      ...options.components,
      schemas: options.components.schemas
    };
  }

  return specJson;
}

registerJsonSchemaMapper("generate", generate, SpecTypes.ASYNCAPI);
