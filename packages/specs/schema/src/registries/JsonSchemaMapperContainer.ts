/**
 * @ignore
 */
export interface JsonSchemaMapper {
  (schema: any, options: any, parent?: any): any;
}

/**
 * @ignore
 */
const JsonSchemaMappersContainer: Map<string, JsonSchemaMapper> = new Map();

/**
 * @ignore
 */
export function registerJsonSchemaMapper(type: string, mapper: JsonSchemaMapper) {
  return JsonSchemaMappersContainer.set(type, mapper);
}

/**
 * @ignore
 */
export function getJsonSchemaMapper(type: string): JsonSchemaMapper {
  // istanbul ignore next
  if (!JsonSchemaMappersContainer.has(type)) {
    throw new Error(`JsonSchema ${type} mapper doesn't exists`);
  }
  return JsonSchemaMappersContainer.get(type)!;
}

/**
 * @ignore
 */
export function execMapper(type: string, schema: any, options: any, parent?: any): any {
  return getJsonSchemaMapper(type)(schema, options, parent);
}

export function hasMapper(type: string) {
  return JsonSchemaMappersContainer.has(type);
}

export function oneOfMapper(...types: string[]): string {
  return types.find((type) => JsonSchemaMappersContainer.has(type))!;
}
