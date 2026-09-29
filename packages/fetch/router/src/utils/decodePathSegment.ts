/**
 * Decodes a percent-encoded path segment. A malformed sequence is returned as is
 * instead of throwing.
 */
export function decodePathSegment(segment: string): string {
  if (segment.indexOf("%") === -1) {
    return segment;
  }

  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
