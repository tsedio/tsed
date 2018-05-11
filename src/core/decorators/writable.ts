/**
 * @module common/core
 */
import {descriptorOf} from "../utils";

/** */

export function Writable(value: boolean = true): Function {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {configurable: true, enumerable: true};
    descriptor.writable = value;
    Object.defineProperty((target && target.prototype) || target, propertyKey, descriptor);

    return descriptor;
  };
}
