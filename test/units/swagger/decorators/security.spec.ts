import {Store} from "../../../../packages/core/class/Store";
import {descriptorOf} from "../../../../packages/core/utils";
import {Security} from "../../../../packages/swagger/decorators/security";
import {expect, assert} from "../../../tools";

class Test {
  test() {}
}

describe("Security()", () => {
  describe("when is used as method decorator", () => {
    before(() => {
      Security("securityDefinitionName", "scope1", "scope2")(Test, "test", descriptorOf(Test, "test"));
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
  describe("when is not used as method decorator", () => {
    it("should set the deprecated", () => {
      assert.throws(() => Security("", "")(Test, "test"), "Security is only supported on method");
    });
  });
});
