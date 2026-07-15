import {Type} from "@tsed/core";
import type {JSONSchema7TypeName} from "json-schema";

import type {JsonSchema} from "../domain/index.js";

export type AnyJsonType = string | Type | JSONSchema7TypeName | JSONSchema7TypeName[];

export interface JsonTypesResolver {
  name: string;
  priority?: number;
  isCollection?: boolean;

  match(type: AnyJsonType): boolean;

  jsonType?(type: AnyJsonType): string;

  targetType?(type: AnyJsonType): Type;

  init?(schema: JsonSchema<any>, type: AnyJsonType): JsonSchema<any>;
}

let resolvers: JsonTypesResolver[] = [];
const cache: Map<AnyJsonType, JsonTypesResolver | undefined> = new Map();

export function defineType(resolver: JsonTypesResolver) {
  resolvers.push(resolver);
  resolvers = resolvers.sort((a, b) => ((a.priority || 0) > (b.priority || 0) ? -1 : 1));
  cache.clear();

  return resolver;
}

export function getTypeResolver(type: AnyJsonType) {
  if (cache.has(type)) {
    return cache.get(type)!;
  }

  const result = resolvers.find((resolver) => {
    return resolver.match(type);
  });

  if (result) {
    cache.set(type, result);
  }

  return result;
}
