import {isFunction} from "./isFunction.js";
import {isObject} from "./isObject.js";
import {isString} from "./isString.js";

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
    if (scope) {
      if (scope[key] !== undefined || (isObject(scope) && key in scope)) {
        return scope[key];
      }

      if (isFunction(scope.get)) {
        return scope.get(key);
      }
    }
  };

  while ((scope = getValue(keys.shift()!)) && keys.length) {}

  return scope === undefined ? defaultValue : scope;
}
