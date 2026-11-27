function readKey(scope: any, key: string) {
  const value = scope[key];

  if (value !== undefined || (typeof scope === "object" && key in scope)) {
    return value;
  }

  if (typeof scope.get === "function") {
    return scope.get(key);
  }

  return undefined;
}

/**
 * Retrieves a value from an object using a dot-separated path expression.
 *
 * Supports flexible argument order (scope-first or expression-first), optional default values,
 * and custom path separators. Can navigate nested objects and call .get() methods when available.
 *
 * @public
 * @since v7.0.0
 */
export function getValue<T = any>(scope: any, expression: string | undefined): T | undefined;
export function getValue<T = any>(scope: any, expression: string | undefined, defaultValue: T, separator?: string): T;
export function getValue<T = any>(expression: string | undefined, scope: any): T | undefined;
export function getValue<T = any>(expression: string | undefined, scope: any, defaultValue: T, separator?: string): T;
export function getValue(arg0: any, arg1: any, defaultValue?: any, separator: any = ".") {
  let expression = arg0;
  let scope = arg1;

  // the scope comes second when it is an object (null included) or when the expression comes first.
  // Named parameters instead of rest args and an options object: this runs for each request parameter
  if (!(typeof arg1 === "object" || typeof arg0 === "string")) {
    expression = arg1;
    scope = arg0;
  }

  if (!expression) {
    return scope;
  }

  if (!scope) {
    return defaultValue;
  }

  if (typeof expression !== "string" || typeof separator !== "string" || separator === "") {
    // unusual separators keep the split() behaviour
    const keys: string[] = expression.split(separator);
    let i = 0;

    while ((scope = readKey(scope, keys[i++])) && i < keys.length) {}

    return scope === undefined ? defaultValue : scope;
  }

  // walks the expression without splitting it into an array; stops on the first falsy value, as before
  let start = 0;

  for (;;) {
    const end = expression.indexOf(separator, start);

    scope = readKey(scope, end === -1 ? expression.slice(start) : expression.slice(start, end));

    if (!scope || end === -1) {
      break;
    }

    start = end + separator.length;
  }

  return scope === undefined ? defaultValue : scope;
}
