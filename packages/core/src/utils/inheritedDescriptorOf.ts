import {ancestorsOf} from "./ancestorsOf.js";

/**
 * Retrieves the property descriptor for a given property key from the target's inheritance chain.
 *
 * @public
 * @since v7.0.0
 */
export function inheritedDescriptorOf(target: any, propertyKey: string): PropertyDescriptor | undefined {
  for (const klass of ancestorsOf(target)) {
    const descriptor = Object.getOwnPropertyDescriptor((klass && klass.prototype) || klass, propertyKey)!;

    if (descriptor) {
      return descriptor;
    }
  }

  return undefined;
}
