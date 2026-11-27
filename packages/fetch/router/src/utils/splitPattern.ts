/**
 * Splits a route pattern into its segments.
 *
 * The leading `/` and a single trailing `/` are dropped, as a trailing slash is
 * optional when matching. Internal empty segments are kept, like Express 5:
 * `/a//b` and `/a/b` are distinct routes.
 */
export function splitPattern(pattern: string): string[] {
  const segments = pattern.split("/");

  if (segments[0] === "") segments.shift();
  if (segments.length && segments[segments.length - 1] === "") segments.pop();

  return segments;
}
