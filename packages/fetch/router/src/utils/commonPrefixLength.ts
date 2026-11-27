/**
 * Returns the length of the longest common prefix of two strings.
 */
export function commonPrefixLength(a: string, b: string): number {
  const max = Math.min(a.length, b.length);
  let i = 0;

  while (i < max && a.charCodeAt(i) === b.charCodeAt(i)) i++;

  return i;
}
