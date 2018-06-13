import {Done} from "./done";
import {loadInjector} from "./loadInjector";

/**
 * The inject function is one of the TsExpressDecorator testing utilities.
 * It injects services into the test function where you can alter, spy on, and manipulate them.
 *
 * The inject function has two parameters
 *
 * * an array of Service dependency injection tokens,
 * * a test function whose parameters correspond exactly to each item in the injection token array.
 *
 * @param targets
 * @param func
 * @returns {any}
 */
export function inject(targets: any[], func: Function) {
  return function before(done: Function) {
    const injector = this.$$injector || loadInjector();

    let isDoneInjected = false;
    const args = targets.map(target => {
      if (target === Done) {
        isDoneInjected = true;

        return done;
      }

      /* istanbul ignore next */
      if (!injector.has(target)) {
        return injector.invoke(target);
      }

      return injector.get(target);
    });

    const result = func.apply(null, args);

    if (!isDoneInjected) done();

    return result;
  };
}
