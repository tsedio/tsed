/**
 * Return a sanitized path
 * @param path
 * @ignore
 */
export function buildPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .join("/");
}
