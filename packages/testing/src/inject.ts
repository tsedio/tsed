import {loadInjector} from "./loadInjector";
import {TestContext} from "./TestContext";

/**
 * The inject function is one of the TsExpressDecorator testing utilities.
 * It injects services into the test function where you can alter, spy on, and manipulate them.
 *
 * The inject function has two parameters
 *
 * * an array of Service dependency injection tokens,
 * * a test function whose parameters correspond exactly to each item in the injection token array.
 */
export function inject<T>(targets: any[], func: (...args: any[]) => Promise<T> | T): () => Promise<T> {
  return async (): Promise<T> => {
    const injector = TestContext.injector || loadInjector();

    const args = targets.map(target => (injector.has(target) ? injector.get(target) : injector.invoke(target)));
    const result = await func(...args);

    return result;
  };
}
