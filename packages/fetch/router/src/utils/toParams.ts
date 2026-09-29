/**
 * Builds a params object by pairing declared names with captured values.
 */
export function toParams(names: string[], values: string[]): Record<string, string> {
  const params: Record<string, string> = {};

  for (let i = 0; i < names.length; i++) {
    params[names[i]] = values[i];
  }

  return params;
}
