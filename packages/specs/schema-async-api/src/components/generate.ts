import {SpecSerializerOptions, SpecTypes, defineSchemaMapper, execMapper} from "@tsed/schema";
import {Type, uniqBy} from "@tsed/core";

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

defineSchemaMapper({type: "generate", transform: generate, spec: SpecTypes.ASYNCAPI});
