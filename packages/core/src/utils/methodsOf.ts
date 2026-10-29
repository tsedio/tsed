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

  const ancestors = ancestorsOf(target);

  // plain loops, and the prototype is resolved once per class instead of twice per key
  for (let i = 0; i < ancestors.length; i++) {
    const klass = ancestors[i];
    const proto = prototypeOf(klass);
    const keys = Reflect.ownKeys(proto);

    for (let j = 0; j < keys.length; j++) {
      const propertyKey = keys[j];

      if (isSymbol(propertyKey) || propertyKey === "constructor" || Object.getOwnPropertyDescriptor(proto, propertyKey)?.get) {
        continue;
      }

      methods.set(propertyKey, {target: klass, propertyKey});
    }
  }

  return Array.from(methods.values());
}
