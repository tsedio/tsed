import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {Deprecated} from "./deprecated";

describe("Deprecated()", () => {
  describe("when is used as method decorator", () => {
    before(() => {});
    it("should set the deprecated", () => {
      class Test {
        @Deprecated()
        test() {}
      }

      const store = Store.from(Test, "test", descriptorOf(Test, "test"));
      expect(store.get("operation").deprecated).to.eq(true);
    });
  });
});
