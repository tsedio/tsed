/**
 * Proxy to avoid circular ref
 * @param target
 * @ignore
 */
export function getJsonEntityStore(target: any) {
  return require("../domain/JsonEntityStore").JsonEntityStore.from(target);
}
