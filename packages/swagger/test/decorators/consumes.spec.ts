import {descriptorOf, Store} from "@tsed/core";
import {assert, expect} from "chai";
import {Consumes} from "../../src";

class Test {
  test() {
  }
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
});
