import {Type} from "@tsed/core";
import {JsonSchemaStore} from "../domain/JsonSchemaStore";
import {SpecTypes} from "../domain/SpecTypes";
import {JsonSerializerOptions} from "../interfaces";
import {serializeJsonSchema} from "./serializeJsonSchema";

const caches: Map<Type<any>, Map<string, any>> = new Map();

function get(model: Type<any>, options: any, cb: any) {
  if (!caches.has(model)) {
    caches.set(model, new Map());
  }

  const cache = caches.get(model)!;
  const key = JSON.stringify(options);

  if (!cache.has(key)) {
    cache.set(key, cb());
  }

  return cache.get(key);
}

export function getJsonSchema(model: Type<any>, options: JsonSerializerOptions = {}) {
  options = {
    ...options,
    spec: options.spec || SpecTypes.JSON,
    root: true,
    schemas: {}
  };

  const storedJson = JsonSchemaStore.from(model);

  return get(model, options, () => {
    return serializeJsonSchema(storedJson.schema, options);
  });
}
