/**
 * Replaces every run of consecutive `/` by a single one.
 */
export function collapseSlashes(path: string): string {
  return path.indexOf("//") === -1 ? path : path.replace(/\/{2,}/g, "/");
}
