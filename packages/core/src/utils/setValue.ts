export function setValue(expression: string, value: any, scope: any, separator = ".") {
  const keys: string[] = expression.split(separator);

  const setValue = (key: string, add: boolean) => {
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
      scope = scope[key] || {};
    }

    return true;
  };

  while (setValue(keys.shift()!, !keys.length)) {}
}
