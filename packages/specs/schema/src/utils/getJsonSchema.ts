import {Type} from "@tsed/core";
import "../components";
import type {JsonEntityStore} from "../domain/JsonEntityStore";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSchemaOptions} from "../interfaces";
import {execMapper} from "../registries/JsonSchemaMapperContainer";
import {getJsonEntityStore} from "./getJsonEntityStore";

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
    const schema = execMapper("schema", entity.schema, options);

    if (Object.keys(options.schemas).length) {
      schema.definitions = options.schemas;
    }

    cache.set(key, schema);
  }

  entity.store.set(CACHE_KEY, cache);

  return cache.get(key);
}

export function getJsonSchema(model: Type<any> | JsonEntityStore, options: JsonSchemaOptions = {}) {
  const entity = getJsonEntityStore(model);

  options = {
    endpoint: true,
    groups: [],
    ...options,
    specType: options.specType || SpecTypes.JSON,
    schemas: {}
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
