import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {MONGOOSE_SCHEMA} from "../../src/constants";
import {VirtualRef} from "../../src/decorators";
import {expect} from "chai";

describe("@VirtualRef()", () => {
  class Test {}
  class RefTest {}

  before(() => {
    VirtualRef("RefTest", "foreign")(Test, "test", descriptorOf(Test, "test"));
    this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
  });

  it("should set metadata", () => {
    expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      ref: "RefTest",
      foreignField: "foreign",
      localField: "test"
    });
  });
});
