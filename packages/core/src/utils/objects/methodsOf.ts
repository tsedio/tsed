import {Type} from "../../domain/Type.js";
import {ancestorsOf} from "./ancestorsOf.js";
import {classOf} from "./classOf.js";
import {isSymbol} from "./isSymbol.js";
import {prototypeOf} from "./prototypeOf.js";

/**
 * Return all methods for a given class.
 * @param target
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
