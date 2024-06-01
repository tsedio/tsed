import {descriptorOf} from "../utils/objects/descriptorOf.js";

export function Enumerable(value: boolean = true): Function {
  return (target: any, propertyKey: string) => {
    const descriptor = descriptorOf(target, propertyKey) || {writable: true, configurable: true};
    descriptor.enumerable = value;
    Object.defineProperty((target && target.prototype) || target, propertyKey, descriptor);

    return descriptor;
  };
}
