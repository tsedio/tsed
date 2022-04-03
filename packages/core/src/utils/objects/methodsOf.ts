import {classOf} from "./classOf";
import {ancestorsOf} from "./ancestorsOf";
import {prototypeOf} from "./prototypeOf";
import {Type} from "../../domain/Type";

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
