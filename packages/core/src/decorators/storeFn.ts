import {DecoratorParameters} from "../types/DecoratorParameters.js";
import {Store} from "../types/Store.js";

/**
 * Creates a decorator factory that initializes a Store from decorator parameters and invokes a callback.
 *
 * The callback receives both the Store instance and the original decorator parameters.
 * If the callback returns a function, that function is invoked with the same decorator parameters.
 *
 * @public
 * @since v7.0.0
 * @see Store
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
