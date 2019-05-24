import {Store} from "../class/Store";
import {DecoratorParameters} from "../interfaces/DecoratorParameters";
/**
 * Create a store correctly configured from the parameters given by the decorator.
 * The `fn` can return a decorator that will be initialized with the parameters (target, propertyKey, descriptor).
 * @param {(store: Store, parameters: DecoratorParameters) => void} fn
 * @returns {Function}
 */
export function StoreFn(fn: (store: Store, parameters: DecoratorParameters) => void): Function {
  return (...parameters: any[]): any => {
    const store = Store.from(...parameters);
    const result: any = fn(store, parameters as DecoratorParameters);
    if (typeof result === "function") {
      result(...parameters);
    }

    return parameters[2];
  };
}
