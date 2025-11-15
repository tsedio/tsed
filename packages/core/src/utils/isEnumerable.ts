import {classOf} from "./classOf.js";
import {inheritedDescriptorOf} from "./inheritedDescriptorOf.js";

/**
 * Checks if a property is enumerable on an object, considering its prototype chain.
 *
 * @public
 * @since v7.0.0
 */
export function isEnumerable(obj: any, key: string) {
  const klass = classOf(obj);

  if (klass) {
    const descriptor = inheritedDescriptorOf(klass, key);

    if (descriptor) {
      return descriptor.enumerable;
    }
  }

  return Object.prototype.propertyIsEnumerable.call(obj, key);
}
