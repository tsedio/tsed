/**
 *
 * @param {string} expression
 * @param scope
 * @param defaultValue
 * @param separator
 * @returns {any}
 */
export function getValue(expression: string, scope: any, defaultValue?: any, separator = ".") {
  const keys: string[] = expression.split(separator);

  const getValue = (key: string) => {
    if (typeof scope.get === "function") {
      return scope.get(key);
    }

    return scope[key];
  };

  while ((scope = getValue(keys.shift()!)) && keys.length) {}

  return scope === undefined ? defaultValue : scope;
}
