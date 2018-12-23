import {InjectorService} from "@tsed/di";

export class TestContext {
  static injector: InjectorService | null = null;

  /**
   * Resets the test injector of the test context, so it won't pollute your next test. Call this in your `tearDown` logic.
   */
  static reset() {
    if (TestContext.injector && TestContext.injector.clear) {
      TestContext.injector.clear();
    }
    TestContext.injector = null;
  }
}
