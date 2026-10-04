const PLACEHOLDER = /\$\{([A-Za-z0-9_]+)\}/g;

/**
 * Replaces the `${NAME}` placeholders of a string with the matching variables.
 *
 * Placeholders without a matching variable are left untouched, and a variable set to `undefined` is replaced
 * with an empty string.
 *
 * @param value String holding the placeholders.
 * @param variables Values indexed by placeholder name.
 * @module platform/mcp
 */
export function interpolate(value: string, variables: Record<string, string | undefined>): string {
  return value.replace(PLACEHOLDER, (placeholder, name: string) =>
    Object.hasOwn(variables, name) ? (variables[name] ?? "") : placeholder
  );
}

/**
 * Tells whether a string references at least one of the given placeholder names.
 *
 * @param value String to inspect.
 * @param names Placeholder names to look for.
 * @module platform/mcp
 */
export function hasPlaceholders(value: string, names: readonly string[]): boolean {
  return [...value.matchAll(PLACEHOLDER)].some(([, name]) => names.includes(name));
}
