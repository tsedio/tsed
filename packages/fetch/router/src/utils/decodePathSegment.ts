const PERCENT = 37;

// Value of each hex digit by char code, -1 for any other char.
const HEX = new Int8Array(128).fill(-1);

for (let i = 0; i < 10; i++) HEX[48 + i] = i;
for (let i = 0; i < 6; i++) HEX[65 + i] = HEX[97 + i] = 10 + i;

function hex(code: number): number {
  return code < 128 ? HEX[code] : -1;
}

/**
 * Decodes a percent-encoded path segment. A malformed sequence is returned as is
 * instead of throwing.
 *
 * Escapes of ASCII chars (`%20`, `%2B`, ...) are decoded inline, which avoids the
 * cost of a native `decodeURIComponent` call on short strings. A segment holding
 * an escape of a non-ASCII byte (UTF-8 sequence) falls back to `decodeURIComponent`.
 */
export function decodePathSegment(segment: string): string {
  let index = segment.indexOf("%");

  if (index === -1) {
    return segment;
  }

  let result = "";
  let start = 0;

  while (index !== -1) {
    const high = hex(segment.charCodeAt(index + 1));
    const low = hex(segment.charCodeAt(index + 2));

    if (high === -1 || low === -1) {
      return segment;
    }

    const byte = (high << 4) | low;

    if (byte >= 0x80) {
      return decodeUtf8(segment);
    }

    result += segment.slice(start, index) + String.fromCharCode(byte);
    start = index + 3;
    index = segment.indexOf("%", start);
  }

  return start === segment.length ? result : result + segment.slice(start);
}

function decodeUtf8(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
