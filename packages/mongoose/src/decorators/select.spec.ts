import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {Select} from "../../src/decorators";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";

describe("@Select()", () => {
  class Test {}

  before(() => {
    Select()(Test, "test", descriptorOf(Test, "test"));
    this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
  });

  it("should set metadata", () => {
    expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      select: true
    });
  });
});
