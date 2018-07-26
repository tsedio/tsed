import {Store} from "../../../../packages/core/src/class/Store";
import {descriptorOf} from "../../../../packages/core/src/utils";
import {Indexed} from "../../../../packages/mongoose/src/decorators";
import {expect} from "../../../tools";
import {MONGOOSE_SCHEMA} from "../../../../packages/mongoose/src/constants";

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
