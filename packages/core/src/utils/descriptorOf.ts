/**
 * Retrieves the property descriptor for a given class and property key.
 *
 * Checks both the target and its prototype for the property descriptor.
 *
 * @public
 * @since v7.0.0
 */
export function descriptorOf(target: any, propertyKey: string | symbol): PropertyDescriptor {
  return Reflect.getOwnPropertyDescriptor((target && target.prototype) || target, propertyKey)!;
}

/**
 * Checks whether a property descriptor represents a method.
 *
 * Returns true if the descriptor has a value property (indicating a method).
 *
 * @public
 * @since v7.0.0
 * @see descriptorOf
 */
export function isMethodDescriptor(target: any, propertyKey: string | symbol) {
  return descriptorOf(target, propertyKey)?.value;
}
