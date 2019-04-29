import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {prototypeOf} from "../../../core/src/utils";
import {Summary} from "../../src";

class Test {
  test() {
  }
}

describe("Summary()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Summary("summary info")(prototypeOf(Test), "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });
    it("should set the summary", () => {
      expect(this.store.get("operation").summary).to.eq("summary info");
    });
  });
});
