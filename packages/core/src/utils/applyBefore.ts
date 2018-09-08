/**
 *
 * @param target
 * @param {string} name
 * @param {Function} callback
 */
export function applyBefore(target: any, name: string, callback: Function) {
  const original = target[name];
  target[name] = function(...args: any[]) {
    callback(...args);

    return original.apply(this, args);
  };
}
