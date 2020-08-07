import {Type} from "@tsed/core";
import {JSONSchema6} from "json-schema";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";

const caches: Map<Type<any>, JSONSchema6> = new Map();

/**
 * Get json schema of the given model.
 *
 * ::: warning
 * Will be remove in v7 in favor of getJsonSchema from @tsed/schema.
 * :::
 *
 * @param target
 */
export function getJsonSchema(target: Type<any>): JSONSchema6 {
  if (!caches.has(target)) {
    caches.set(target, JsonSchemesRegistry.getSchemaDefinition(target));
  }

  return caches.get(target)!;
}

export function deleteSchema(target: Type<any>) {
  caches.delete(target);
}
