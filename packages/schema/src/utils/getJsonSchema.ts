import {Type} from "@tsed/core";
import {JsonEntityStore} from "../domain/JsonEntityStore";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSerializerOptions} from "../interfaces";
import {serializeJsonSchema} from "./serializeJsonSchema";

const CACHE_KEY = "$cache:schemes";

function getKey(options: any) {
  return JSON.stringify(options);
}

function get(entity: JsonEntityStore, options: any) {
  const cache: Map<string, any> = entity.store.get(CACHE_KEY) || new Map();
  const key = getKey(options);

  if (!cache.has(key)) {
    const schema = serializeJsonSchema(entity.schema, {...options, root: false});

    if (Object.keys(options.schemas).length) {
      schema.definitions = options.schemas;
    }

    cache.set(key, schema);
  }

  entity.store.set(CACHE_KEY, cache);

  return cache.get(key);
}

export function getJsonSchema(model: Type<any> | JsonEntityStore, options: JsonSerializerOptions = {}) {
  options = {
    ...options,
    root: true,
    spec: options.spec || SpecTypes.JSON,
    schemas: {}
  };

  const entity = model instanceof JsonEntityStore ? model : JsonEntityStore.from(model);

  return get(entity, options);
}
