/**
 * Splits an array in half, returning the left and right segments.
 *
 * @module platform/mcp
 * @since 8.17.0
 */
export const half = <T>(arr: T[]): [T[], T[]] => {
  return [arr.slice(0, arr.length / 2), arr.slice(arr.length / 2)];
};
