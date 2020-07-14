export enum JsonParameterTypes {
  BODY = "body",
  PATH = "path",
  QUERY = "query",
  HEADER = "header",
  COOKIES = "cookies"
}

export function isParameterType(type: string) {
  return Object.values(JsonParameterTypes).includes(String(type).toLowerCase() as any);
}
