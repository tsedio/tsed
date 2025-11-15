import {Store} from "../types/Store.js";
import {classOf} from "./classOf.js";
import {descriptorOf} from "./descriptorOf.js";
import {methodsOf} from "./methodsOf.js";
import {prototypeOf} from "./prototypeOf.js";

/**
 * Applies a decorator to all methods of a class, copying inherited methods if necessary.
 *
 * For each method, if inherited from a parent class, it first copies the method to the target class
 * and merges its Store metadata, then applies the decorator.
 *
 * @public
 * @since v7.0.0
 * @see methodsOf
 * @see Store
 */
export function decorateMethodsOf(klass: any, decorator: any) {
  methodsOf(klass).forEach(({target, propertyKey}) => {
    const proto = prototypeOf(klass);

    if (target !== classOf(klass)) {
      Object.defineProperty(proto, propertyKey, {
        writable: true,
        configurable: true,
        value(...args: any[]) {
          return prototypeOf(target)[propertyKey].apply(this, args);
        }
      });

      Store.mergeStoreMethodFrom(klass, target, propertyKey);
    }

    let descriptor = descriptorOf(klass, propertyKey);

    const newDescriptor = decorator(proto, propertyKey, descriptor) || descriptor;

    if (newDescriptor) {
      Object.defineProperty(proto, propertyKey, newDescriptor);
    }
  });
}
