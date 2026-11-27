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
  const last = keys.length - 1;

  // plain loop: no closure and no keys.shift() per call
  for (let i = 0; i <= last; i++) {
    const key = keys[i];

    if (isProtectedKey(key)) {
      return;
    }

    if (i === last) {
      if (typeof scope.set === "function") {
        scope.set(key, value);
      } else {
        scope[key] = value;
      }

      return;
    }

    if (typeof scope.set === "function") {
      if (!scope.has(key)) {
        scope.set(key, {});
      }

      scope = scope.get(key);
    } else {
      scope = scope[key] = scope[key] || {};
    }
  }
}
