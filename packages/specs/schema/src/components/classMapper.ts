import {JsonEntityStore} from "../domain/JsonEntityStore";
import {JsonSchema} from "../domain/JsonSchema";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions";
import {execMapper, registerJsonSchemaMapper} from "../registries/JsonSchemaMapperContainer";
import {mapGenericsOptions, popGenerics} from "../utils/generics";
import {createRef, createRefName} from "../utils/ref";

export function classMapper(value: JsonSchema, options: JsonSchemaOptions) {
  const store = JsonEntityStore.from(value.class);
  const name = createRefName(store.schema.getName() || value.getName(), options);

  if (value.hasGenerics) {
    // Inline generic
    const {type, properties, additionalProperties, items, ...props} = value.toJSON(options);
    const schema = {
      ...execMapper("any", store.schema, {
        ...options,
        ...popGenerics(value),
        root: false
      }),
      ...props
    };

    if (schema.title) {
      const name = createRefName(schema.title, options);
      options.schemas![name] = schema;
      delete schema.title;

      return createRef(name, value, options);
    }

    return schema;
  }

  if (options.schemas && !options.schemas[name]) {
    options.schemas[name] = {}; // avoid infinite calls
    options.schemas[name] = execMapper(
      "any",
      store.schema,
      mapGenericsOptions({
        ...options,
        root: false
      })
    );
  }

  return createRef(name, value, options);
}

registerJsonSchemaMapper("class", classMapper);
