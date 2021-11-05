export function concatPath(basePath: string | undefined, path: string | undefined): string {
  return ((basePath || "") + (path || "")).replace(/\/\//gi, "/");
}
