import {Store} from "../../../../src/core/class/Store";
import {descriptorOf} from "../../../../src/core/utils";
import {Responses} from "../../../../src/swagger/decorators/responses";
import {expect} from "../../../tools";

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
