import {Type, uniqBy} from "@tsed/core";
import {execMapper, registerJsonSchemaMapper, SpecSerializerOptions, SpecTypes} from "@tsed/schema";

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
