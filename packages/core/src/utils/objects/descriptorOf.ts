/**
 * Return the descriptor for a given class and propertyKey
 * @param target
 * @param {string} propertyKey
 * @returns {PropertyDescriptor}
 */
export function descriptorOf(target: any, propertyKey: string | symbol): PropertyDescriptor {
  return Reflect.getOwnPropertyDescriptor((target && target.prototype) || target, propertyKey)!;
}

export function isMethodDescriptor(target: any, propertyKey: string | symbol) {
  return descriptorOf(target, propertyKey)?.value;
}
