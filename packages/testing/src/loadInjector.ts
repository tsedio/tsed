import {TestContext} from "./TestContext";

/**
 * @deprecated Use TestContext.create instead of.
 */
/* istanbul ignore next */
export async function loadInjector() {
  await TestContext.create();
}
