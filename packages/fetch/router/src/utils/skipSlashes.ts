/**
 * Returns the index of the first character at or after `index` that is not a `/`.
 */
export function skipSlashes(path: string, index: number): number {
  while (path.charCodeAt(index) === 47) {
    index++;
  }

  return index;
}
