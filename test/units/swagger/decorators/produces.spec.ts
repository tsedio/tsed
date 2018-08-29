import {Store} from "../../../../packages/core/class/Store";
import {descriptorOf} from "../../../../packages/core/utils";
import {Produces} from "../../../../packages/swagger";
import {assert, expect} from "../../../tools";

class Test {
  test() {}
}

describe("Produces()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Produces("text/html")(Test, "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });
    it("should set the produces", () => {
      expect(this.store.get("operation").produces).to.deep.eq(["text/html"]);
    });
  });

  describe("when is not used as method decorator", () => {
    it("should throw an exception", () => {
      assert.throws(() => Produces("text/html")(Test, "test"), "Produces is only supported on method");
    });
  });
});
