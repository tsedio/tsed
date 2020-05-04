import {Type} from "@tsed/core";
import {JSONSchema6} from "json-schema";
import {JsonSchemesRegistry} from "../registries/JsonSchemesRegistry";

const caches: Map<Type<any>, JSONSchema6> = new Map();

export function getJsonSchema(target: Type<any>): JSONSchema6 {
  if (!caches.has(target)) {
    caches.set(target, JsonSchemesRegistry.getSchemaDefinition(target));
  }

  return caches.get(target)!;
}

export function deleteSchema(target: Type<any>) {
  caches.delete(target);
}
