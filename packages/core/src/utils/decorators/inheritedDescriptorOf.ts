import {ancestorsOf} from "../objects/ancestorsOf.js";

export function inheritedDescriptorOf(target: any, propertyKey: string): PropertyDescriptor | undefined {
  for (const klass of ancestorsOf(target)) {
    const descriptor = Object.getOwnPropertyDescriptor((klass && klass.prototype) || klass, propertyKey)!;

    if (descriptor) {
      return descriptor;
    }
  }

  return undefined;
}
