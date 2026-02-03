export function toPrefix(endpoint: string) {
  return endpoint === "/" ? "/" : endpoint.endsWith("/") ? endpoint : `${endpoint}/`;
}
