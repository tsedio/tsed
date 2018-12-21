import {TestContext} from "./TestContext";

/**
 * @deprecated Use TestContext.create instead of.
 */
export async function loadInjector() {
  await TestContext.create();
}
