import {descriptorOf, Store} from "@tsed/core";
import {assert, expect} from "chai";
import {prototypeOf} from "../../../core/src/utils";
import {Produces} from "../../src";

class Test {
  test() {
  }
}

describe("Produces()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Produces("text/html")(prototypeOf(Test), "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });
    it("should set the produces", () => {
      expect(this.store.get("operation").produces).to.deep.eq(["text/html"]);
    });
  });
});
