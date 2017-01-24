import {Done} from "./done";
import {ExpressApplication, InjectorService} from "../services";

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

    if (!InjectorService.has(ExpressApplication)) {
       InjectorService.set(ExpressApplication, {
           use: () => (undefined)
       });
    }

    return (done) => {

        let isDoneInjected = false;
        const args = targets.map((target) => {

            if (target === Done) {
                isDoneInjected = true;
                return done;
            }

            /* istanbul ignore next */
            if (!InjectorService.has(target)) {
                InjectorService.construct(target);
            }

            return InjectorService.get(target);
        });

        func.apply(null, args);

        if (!isDoneInjected) done();
    };

}