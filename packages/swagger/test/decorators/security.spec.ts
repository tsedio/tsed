import {descriptorOf, Store} from "@tsed/core";
import {expect} from "chai";
import {prototypeOf} from "../../../core/src/utils";
import {Security} from "../../src";

class Test {
  test() {
  }
}

describe("Security()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Security("securityDefinitionName", "scope1", "scope2")(prototypeOf(Test), "test", descriptorOf(Test, "test"));
      this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
    });
    it("should set the security", () => {
      expect(this.store.get("operation").security).to.deep.eq([
        {
          securityDefinitionName: ["scope1", "scope2"]
        }
      ]);
    });
  });
});
