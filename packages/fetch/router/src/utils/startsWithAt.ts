// Measured on V8: below this length a char code loop wins, above it `indexOf` does.
const LOOP_MAX_LENGTH = 4;

/**
 * Returns whether `path` holds `prefix` at `index`.
 *
 * Same result as `path.startsWith(prefix, index)`, which V8 runs several times
 * slower than `indexOf` once an offset is given. On a mismatch `indexOf` keeps
 * scanning the rest of the path, a cost bounded by the path length.
 */
export function startsWithAt(path: string, prefix: string, index: number): boolean {
  const length = prefix.length;

  if (length > LOOP_MAX_LENGTH) {
    return path.indexOf(prefix, index) === index;
  }

  for (let i = 0; i < length; i++) {
    if (path.charCodeAt(index + i) !== prefix.charCodeAt(i)) {
      return false;
    }
  }

  return true;
}
