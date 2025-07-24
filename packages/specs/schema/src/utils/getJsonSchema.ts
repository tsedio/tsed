import "../components/index.js";

import {getValue, isClass, isPlainObject, nameOf, Type} from "@tsed/core";

import {JsonParameterStore} from "../domain/JsonParameterStore.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {getJsonEntityStore} from "./getJsonEntityStore.js";

/**
 * @ignore
 */
const CACHES = new Map<Type | JsonParameterStore, Map<string, any>>();

/**
 * @ignore
 */
function getKey(options: any) {
  return JSON.stringify(options, (key, value) => {
    if (value && !isPlainObject(value) && isClass(value)) {
      return nameOf(value);
    }

    return value;
  });
}

/**
 * @ignore
 */
function get(model: Type | JsonParameterStore, options: any) {
  const cache: Map<string, any> = CACHES.get(model) || new Map();
  CACHES.set(model, cache);

  const key = getKey(options);

  if (!cache.has(key)) {
    const entity = getJsonEntityStore(model);

    let mapper = "schema";
    if (entity instanceof JsonParameterStore) {
      options = {
        ...options,
        root: true,
        groups: entity.schema.getGroups()
      };
      mapper = "item";
    }

    const schema = execMapper(mapper, [entity.schema], options);

    if (Object.keys(getValue(options, "components.schemas", {})).length) {
      schema.definitions = options.components.schemas;
    }

    cache.set(key, schema);
  }

  return cache.get(key);
}

export function getJsonSchema(model: Type<any> | JsonParameterStore, options: JsonSchemaOptions = {}) {
  const specType = options.specType || SpecTypes.JSON;

  options = {
    endpoint: true,
    groups: [],
    inlineEnums: specType === SpecTypes.JSON,
    ...options,
    specType,
    components: {
      schemas: {}
    }
  };

  return get(model, options);
}
