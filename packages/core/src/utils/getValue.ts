import {isFunction, isObject, isString} from "./ObjectUtils";

const mapOptions = (args: any[]) => {
  const [expression, scope, defaultValue, separator = "."] = args;

  if (isObject(scope) || isString(expression)) {
    return {
      expression,
      scope,
      defaultValue,
      separator
    };
  }

  return {
    expression: scope,
    scope: expression,
    defaultValue,
    separator
  };
};

/**
 * Get value from scope
 * @param {string} expression
 * @param scope
 * @returns {any}
 */
export function getValue<T = any>(scope: any, expression: string | undefined): T | undefined;
/**
 * Get value from scope
 * @param {string} expression
 * @param scope
 * @param defaultValue
 * @param separator
 * @returns {any}
 */
export function getValue<T = any>(scope: any, expression: string | undefined, defaultValue: T, separator?: string): T;
/**
 * Get value from scope
 * @param {string} expression
 * @param scope
 * @returns {any}
 */
export function getValue<T = any>(expression: string | undefined, scope: any): T | undefined;
/**
 * Get value from scope
 * @param {string} expression
 * @param scope
 * @param defaultValue
 * @param separator
 * @returns {any}
 */
export function getValue<T = any>(expression: string | undefined, scope: any, defaultValue: T, separator?: string): T;
export function getValue(...args: any[]) {
  const options = mapOptions(args);
  let scope = options.scope;
  const {expression, defaultValue, separator} = options;

  if (!expression) {
    return scope;
  }

  if (!scope) {
    return defaultValue;
  }

  const keys: string[] = expression.split(separator);

  const getValue = (key: string) => {
    if (scope instanceof Map || isFunction(scope.get)) {
      return scope.get(key);
    }

    return scope[key];
  };

  while ((scope = getValue(keys.shift()!)) && keys.length) {}

  return scope === undefined ? defaultValue : scope;
}
