import {SpecTypes} from "../domain/SpecTypes";

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
 */
export function registerJsonSchemaMapper(type: string, mapper: JsonSchemaMapper, spec?: SpecTypes) {
  return JsonSchemaMappersContainer.set(spec ? `${spec}:${type}` : type, mapper);
}

/**
 * @ignore
 */
export function getJsonSchemaMapper(type: string, options: any): JsonSchemaMapper {
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
  return getJsonSchemaMapper(type, options)(...args, options, parent);
}

export function hasMapper(type: string) {
  return JsonSchemaMappersContainer.has(type);
}

export function oneOfMapper(types: string[], options: any): string {
  return (
    types.find((type) => JsonSchemaMappersContainer.has(`${options?.specType}:${type}`)) ||
    types.find((type) => JsonSchemaMappersContainer.has(type))!
  );
}
