/**
 * Returns the index following the last character that is not a trailing `/`.
 */
export function trimTrailingSlashes(path: string): number {
  let end = path.length;

  while (end > 0 && path.charCodeAt(end - 1) === 47) {
    end--;
  }

  return end;
}
