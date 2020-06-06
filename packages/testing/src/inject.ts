import {TestContext} from "./TestContext";

/**
 * The inject function is one of the TsExpressDecorator testing utilities.
 * It injects services into the test function where you can alter, spy on, and manipulate them.
 *
 * The inject function has two parameters
 *
 * * an array of Service dependency injection tokens,
 * * a test function whose parameters correspond exactly to each item in the injection token array.
 *
 * @deprecated Use PlatformTest.inject instead of
 * @alias TestContext.inject
 */
/* istanbul ignore next */
export function inject<T>(targets: any[], func: (...args: any[]) => Promise<T> | T): () => Promise<T> {
  return TestContext.inject(targets, func);
}
