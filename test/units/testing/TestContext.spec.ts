import {loadInjector, TestContext} from "@tsed/testing";
import {Provider} from "@tsed/di";
import {expect} from "../../tools";

describe("TestContext", () => {
  describe("reset()", () => {
    it("should reset the injector", () => {
      const injector = loadInjector();
      const injectionKey = "key";
      TestContext.injector = injector;
      TestContext.injector.set(injectionKey, new Provider("something"));
      TestContext.reset();
      expect(injector).lengthOf(0);
      expect(TestContext.injector).eq(null);
    });
  });
});
