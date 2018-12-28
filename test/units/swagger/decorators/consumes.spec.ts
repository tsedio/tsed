import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {Consumes} from "../../../../packages/swagger/src";
import {assert, expect} from "chai";

class Test {
  test() {}
}

describe("Consumes()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Consumes("text/html")(Test.prototype, "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test.prototype, "test", descriptorOf(Test, "test"));
    });
    it("should set the produces", () => {
      expect(this.store.get("operation").consumes).to.deep.eq(["text/html"]);
    });
  });

  describe("when is not used as method decorator", () => {
    it("should throw an exception", () => {
      assert.throws(() => Consumes("text/html")(Test, "test"), "Consumes is only supported on method");
    });
  });
});
