import {Type} from "../../domain/Type.js";
import {ancestorsOf} from "./ancestorsOf.js";
import {classOf} from "./classOf.js";
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
      if (propertyKey !== "constructor") {
        methods.set(propertyKey, {target, propertyKey});
      }
    });
  });

  return Array.from(methods.values());
}
