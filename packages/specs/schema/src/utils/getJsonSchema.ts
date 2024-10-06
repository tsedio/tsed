import "../components/index.js";

import {getValue, Type} from "@tsed/core";

import type {JsonEntityStore} from "../domain/JsonEntityStore.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";
import {execMapper} from "../registries/JsonSchemaMapperContainer.js";
import {getJsonEntityStore} from "./getJsonEntityStore.js";

/**
 * @ignore
 */
const CACHE_KEY = "$cache:schemes";

/**
 * @ignore
 */
function getKey(options: any) {
  return JSON.stringify(options);
}

/**
 * @ignore
 */
function get(entity: JsonEntityStore, options: any) {
  const cache: Map<string, any> = entity.store.get(CACHE_KEY) || new Map();
  const key = getKey(options);

  if (!cache.has(key)) {
    const schema = execMapper("schema", [entity.schema], options);

    if (Object.keys(getValue(options, "components.schemas", {})).length) {
      schema.definitions = options.components.schemas;
    }

    cache.set(key, schema);
  }

  entity.store.set(CACHE_KEY, cache);

  return cache.get(key);
}

export function getJsonSchema(model: Type<any> | any, options: JsonSchemaOptions = {}) {
  const entity = getJsonEntityStore(model);
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

  if (entity.decoratorType === "parameter") {
    options = {
      ...options,
      genericTypes: entity.nestedGenerics[0],
      nestedGenerics: entity.nestedGenerics,
      groups: entity.parameter?.groups
    };
  }

  return get(entity, options);
}
