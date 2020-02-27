import {Store} from "@tsed/core";
import {descriptorOf} from "@tsed/core";
import {Indexed} from "../../src/decorators";
import {expect} from "chai";
import {MONGOOSE_SCHEMA} from "../../src/constants";

describe("@Indexed()", () => {
  class Test {}

  before(() => {
    Indexed()(Test, "test", descriptorOf(Test, "test"));
    this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
  });

  it("should set metadata", () => {
    expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      index: true
    });
  });
});
