import {InjectorService} from "@tsed/common";
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
  loadInjector();

  return (done: Function) => {
    let isDoneInjected = false;
    const args = targets.map(target => {
      if (target === Done) {
        isDoneInjected = true;

        return done;
      }

      /* istanbul ignore next */
      if (!InjectorService.has(target)) {
        return InjectorService.invoke(target);
      }

      return InjectorService.get(target);
    });

    func.apply(null, args);

    if (!isDoneInjected) done();
  };
}
