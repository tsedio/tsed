export enum JsonParameterTypes {
  BODY = "body",
  PATH = "path",
  QUERY = "query",
  HEADER = "header",
  COOKIES = "cookies",
  FILES = "files"
}
/**
 * @ignore
 */
export function formatParameterType(type: any): any {
  return String(type).toLowerCase().replace("raw_", "");
}
/**
 * @ignore
 */
export function isParameterType(type: string) {
  return Object.values(JsonParameterTypes).includes(formatParameterType(type) as any);
}
