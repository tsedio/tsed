/**
 * Return a sanitized path
 * @param path
 */
export function buildPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .join("/");
}
