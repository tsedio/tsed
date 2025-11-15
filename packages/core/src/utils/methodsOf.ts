import type {Type} from "../types/Type.js";
import {ancestorsOf} from "./ancestorsOf.js";
import {classOf} from "./classOf.js";
import {isSymbol} from "./isSymbol.js";
import {prototypeOf} from "./prototypeOf.js";

/**
 * Returns all methods for a given class by traversing its prototype chain.
 *
 * @public
 * @since v7.0.0
 */
export function methodsOf(target: any): {target: Type; propertyKey: string}[] {
  const methods = new Map();
  target = classOf(target);

  ancestorsOf(target).forEach((target) => {
    const keys = Reflect.ownKeys(prototypeOf(target));

    keys.forEach((propertyKey: string) => {
      if (isSymbol(propertyKey) || propertyKey === "constructor" || Object.getOwnPropertyDescriptor(prototypeOf(target), propertyKey)?.get)
        return;
      methods.set(propertyKey, {target, propertyKey});
    });
  });

  return Array.from(methods.values());
}
