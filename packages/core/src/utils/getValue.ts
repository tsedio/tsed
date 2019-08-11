/**
 *
 * @param {string} expression
 * @param scope
 * @param defaultValue
 * @param separator
 * @returns {any}
 */
export function getValue(expression: string | undefined, scope: any, defaultValue?: any, separator = ".") {
  if (!expression) {
    return scope;
  }

  const keys: string[] = expression.split(separator);

  const getValue = (key: string) => {
    if (scope instanceof Map) {
      return scope.get(key);
    }

    return scope[key];
  };

  while ((scope = getValue(keys.shift()!)) && keys.length) {}

  return scope === undefined ? defaultValue : scope;
}
