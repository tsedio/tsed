/**
 * Proxy to avoid circular ref
 * @param target
 */
export function getJsonSchemaStore(target: any) {
  return require("../domain/JsonSchemaStore").JsonSchemaStore.from(target);
}
