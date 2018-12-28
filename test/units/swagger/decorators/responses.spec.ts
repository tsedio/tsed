import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {Responses} from "../../../../packages/swagger/src/decorators/responses";
import {expect} from "chai";

class Test {
  test() {}
}

describe("Responses()", () => {
  before(() => {
    Responses(400, {
      description: "Bad Request"
    })(Test, "test", descriptorOf(Test, "test"));
    this.store = Store.fromMethod(Test, "test");
  });
  it("should set the responses", () => {
    expect(this.store.get("responses")).to.deep.eq({
      "400": {
        description: "Bad Request"
      }
    });
  });
});
