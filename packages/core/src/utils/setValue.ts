import {isProtectedKey} from "./isProtectedKey.js";

/**
 * Sets a value on an object using a dot-notation expression path.
 *
 * Supports both plain objects and Map-like objects (with `.set()`, `.get()`, `.has()` methods).
 * Automatically creates intermediate objects as needed. Protected keys (`__proto__`, `constructor`, `prototype`) are ignored for security.
 *
 * ```typescript
 * const obj = {};
 * setValue(obj, "user.name", "John");
 * // obj is now { user: { name: "John" } }
 * ```
 *
 * @param scope - The target object or Map to set the value on
 * @param expression - Dot-notation path to the property (e.g., "user.profile.name")
 * @param value - The value to set at the specified path
 * @param separator - Path separator character (default: ".")
 * @returns void
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
