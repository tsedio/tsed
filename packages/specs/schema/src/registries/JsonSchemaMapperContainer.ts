import {isArray} from "@tsed/core";

import {SpecTypes} from "../domain/SpecTypes.js";

/**
 * @ignore
 */
export interface JsonSchemaMapper {
  (...args: any[]): any;
}

/**
 * @ignore
 */
const JsonSchemaMappersContainer: Map<string, JsonSchemaMapper> = new Map();

/**
 * @ignore
 * @deprecated
 */
export function registerJsonSchemaMapper(type: string, mapper: JsonSchemaMapper, spec?: SpecTypes) {
  return defineSchemaMapper({spec, type, transform: mapper});
}

export function defineSchemaMapper({
  spec,
  type,
  transform
}: {
  type: string;
  transform: JsonSchemaMapper;
  spec?: SpecTypes | SpecTypes[];
}): void {
  if (isArray(spec)) {
    spec.map((spec) => defineSchemaMapper({spec, type, transform}));
    return;
  }

  JsonSchemaMappersContainer.set(spec ? `${spec}:${type}` : type, transform);
}

/**
 * @ignore
 */
export function compileMapper(type: string, options: any): JsonSchemaMapper {
  const mapper = JsonSchemaMappersContainer.get(`${options?.specType}:${type}`)! || JsonSchemaMappersContainer.get(type)!;

  if (mapper) {
    return mapper;
  }

  // istanbul ignore next
  throw new Error(`JsonSchema ${type} mapper doesn't exists`);
}

/**
 * @ignore
 */
export function execMapper(type: string, args: any[], options: any, parent?: any): any {
  return compileMapper(type, options)(...args, options, parent);
}

export function hasMapper(type: string) {
  return JsonSchemaMappersContainer.has(type);
}

export function execOneOfMapper(types: string[], options: any): string {
  return (
    types.find((type) => JsonSchemaMappersContainer.has(`${options?.specType}:${type}`)) ||
    types.find((type) => JsonSchemaMappersContainer.has(type))!
  );
}
