import {createRef, createRefName} from "../../../utils/ref.js";
import {defineSchemaMapper, execMapper} from "../../../registries/JsonSchemaMapperContainer.js";
import {getValue, setValue} from "@tsed/core";
import {JsonSchema} from "../../../domain/index.js";
import {JsonSchemaOptions} from "../../../domain/JsonSchemaOptions.js";
import {getJsonEntityStore} from "../../../registries/JsonEntitiesContainer.js";

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

defineSchemaMapper({type: "class", transform: classMapper});
