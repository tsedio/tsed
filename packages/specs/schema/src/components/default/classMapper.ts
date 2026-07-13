import {getValue, setValue} from "@tsed/core";
import {getJsonEntityStore, JsonSchema} from "../../domain/index.js";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions.js";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer.js";
import {createRef, createRefName} from "../../utils/ref.js";

export function classMapper(value: JsonSchema, options: JsonSchemaOptions) {
  const store = getJsonEntityStore(value.class);
  const name = createRefName(store.schema.getName() || value.getName(), options);

  if (!getValue(options, `components.schemas.${name}`)) {
    // avoid infinite calls
    setValue(options, `components.schemas.${name}`, {});

    options.components!.schemas[name] = execMapper("any", [store.schema], {
      ...options,
      root: false
    });
  }

  return createRef(name, value, options);
}

registerJsonSchemaMapper("class", classMapper);
