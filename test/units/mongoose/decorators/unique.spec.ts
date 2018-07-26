import {Store} from "../../../../packages/core/class/Store";
import {descriptorOf} from "../../../../packages/core/utils";
import {Unique} from "../../../../packages/mongoose/decorators";
import {expect} from "../../../tools";
import {MONGOOSE_SCHEMA} from "../../../../packages/mongoose/constants";

describe("@Unique()", () => {
  class Test {}

  before(() => {
    Unique()(Test, "test", descriptorOf(Test, "test"));
    this.store = Store.from(Test, "test", descriptorOf(Test, "test"));
  });

  it("should set metadata", () => {
    expect(this.store.get(MONGOOSE_SCHEMA)).to.deep.eq({
      unique: true
    });
  });
});
