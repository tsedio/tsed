import {inheritedDescriptorOf} from "../decorators/inheritedDescriptorOf.js";
import {classOf} from "./classOf.js";

/**
 *
 * @param obj
 * @param key
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
