import {Type} from "@tsed/core";
import type {JSONSchema7TypeName} from "json-schema";

import {JsonSchema} from "../..";

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

export function defineType(resolver: JsonTypesResolver) {
  resolvers.push(resolver);
  resolvers = resolvers.sort((a, b) => ((a.priority || 0) > (b.priority || 0) ? -1 : 1));

  return resolver;
}

const cache: Map<AnyJsonType, JsonTypesResolver | undefined> = new Map();

export function getTypeResolver(type: AnyJsonType) {
  if (cache.has(type)) {
    return cache.get(type)!;
  }

  const result = resolvers.find((resolver) => {
    return resolver.match(type);
  });

  cache.set(type, result);

  return result;
}
