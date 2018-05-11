import {Store} from "../../../../src/core/class/Store";
import {descriptorOf} from "../../../../src/core/utils";
import {Indexed} from "../../../../src/mongoose/decorators";
import {expect} from "../../../tools";
import {MONGOOSE_SCHEMA} from "../../../../src/mongoose/constants";

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
