import {getValue, Type, uniqBy} from "@tsed/core";

import {SpecTypes} from "../../../domain/SpecTypes.js";
import {SpecSerializerOptions} from "../../../fn/oas/getSpec.js";
import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";

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

defineSchemaMapper({type: "generate", transform: generate, spec: [SpecTypes.OPENAPI, SpecTypes.SWAGGER]});
