/**
 * Splits a route pattern into its non-empty segments.
 */
export function splitPattern(pattern: string): string[] {
  return pattern.split("/").filter(Boolean);
}
