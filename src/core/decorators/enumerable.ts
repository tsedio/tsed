/**
 * @module common/core
 */
import {descriptorOf} from "../utils";

/** */

export function Enumerable(value: boolean = true): Function {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {writable: true, configurable: true};
    descriptor.enumerable = value;
    Object.defineProperty((target && target.prototype) || target, propertyKey, descriptor);

    return descriptor;
  };
}
