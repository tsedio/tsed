import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {prototypeOf} from "../../../core/src/utils";
import {Deprecated} from "../../src/decorators/deprecated";
import {assert, expect} from "chai";

class Test {
  test() {}
}

describe("Deprecated()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Deprecated()(prototypeOf(Test), "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });
    it("should set the deprecated", () => {
      expect(this.store.get("operation").deprecated).to.eq(true);
    });
  });
});
