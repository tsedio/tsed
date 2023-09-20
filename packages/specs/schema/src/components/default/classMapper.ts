import {getValue, setValue} from "@tsed/core";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {JsonSchema} from "../../domain/JsonSchema";
import {JsonSchemaOptions} from "../../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../../registries/JsonSchemaMapperContainer";
import {mapGenericsOptions, popGenerics} from "../../utils/generics";
import {createRef, createRefName} from "../../utils/ref";

export function classMapper(value: JsonSchema, options: JsonSchemaOptions) {
  const store = JsonEntityStore.from(value.class);
  const name = createRefName(store.schema.getName() || value.getName(), options);

  if (value.hasGenerics) {
    // Inline generic
    const {type, properties, additionalProperties, items, ...props} = value.toJSON(options);
    const schema = {
      ...execMapper("any", [store.schema], {
        ...options,
        ...popGenerics(value),
        root: false
      }),
      ...props
    };

    if (schema.title) {
      const name = createRefName(schema.title, options);
      setValue(options.components, `schemas.${name}`, schema);

      delete schema.title;

      return createRef(name, value, options);
    }

    return schema;
  }

  if (!getValue(options, `components.schemas.${name}`)) {
    // avoid infinite calls
    setValue(options, `components.schemas.${name}`, {});

    options.components!.schemas[name] = execMapper(
      "any",
      [store.schema],
      mapGenericsOptions({
        ...options,
        root: false
      })
    );
  }

  return createRef(name, value, options);
}

registerJsonSchemaMapper("class", classMapper);
