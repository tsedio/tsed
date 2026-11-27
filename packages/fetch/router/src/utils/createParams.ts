/**
 * Builds the params object of a match from the captured values.
 *
 * The first four values are received as arguments so the lookup never allocates
 * an array for the common case; further values are read from `extra`.
 */
export function createParams(
  names: string[],
  p0: string | undefined,
  p1: string | undefined,
  p2: string | undefined,
  p3: string | undefined,
  extra: string[] | null
): Record<string, string> {
  const params: Record<string, string> = {};

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const value = (i === 0 ? p0 : i === 1 ? p1 : i === 2 ? p2 : i === 3 ? p3 : extra![i - 4])!;

    if (name === "__proto__") {
      // A plain assignment would call the inherited `__proto__` setter instead of creating the param.
      Object.defineProperty(params, name, {value, enumerable: true, writable: true, configurable: true});
    } else {
      params[name] = value;
    }
  }

  return params;
}
