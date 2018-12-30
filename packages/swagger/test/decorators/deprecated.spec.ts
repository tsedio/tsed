import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {Deprecated} from "../../src/decorators/deprecated";
import {assert, expect} from "chai";

class Test {
  test() {}
}

describe("Deprecated()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Deprecated()(Test, "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });
    it("should set the deprecated", () => {
      expect(this.store.get("operation").deprecated).to.eq(true);
    });
  });

  describe("when is not used as method decorator", () => {
    it("should throw an exception", () => {
      assert.throws(() => Deprecated()(Test, "test"), "Deprecated is only supported on method");
    });
  });
});
