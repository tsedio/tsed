import {isProtectedKey} from "./isProtectedKey.js";

/**
 * Sets a value on an object using a dot-notation expression path.
 *
 * @public
 * @since v7.0.0
 */
export function setValue(scope: any, expression: string, value: any, separator = ".") {
  const keys: string[] = expression.split(separator);

  const setValue = (key: string, add: boolean) => {
    if (isProtectedKey(key)) {
      return false;
    }

    if (add) {
      if (typeof scope.set === "function") {
        scope.set(key, value);
      } else {
        scope[key] = value;
      }

      return false;
    }

    if (typeof scope.set === "function") {
      if (!scope.has(key)) {
        scope.set(key, {});
      }

      scope = scope.get(key);
    } else {
      scope = scope[key] = scope[key] || {};
    }

    return true;
  };

  while (setValue(keys.shift()!, !keys.length)) {}
}
