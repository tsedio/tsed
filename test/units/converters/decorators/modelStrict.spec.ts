import {ModelStrict} from "../../../../packages/common/src/converters";
import {Store} from "../../../../packages/core/src/class/Store";
import {expect} from "../../../tools";

class Test {}

describe("ModelStrict", () => {
  describe("string type", () => {
    before(() => {
      ModelStrict(true)(Test);
      this.store = Store.from(Test);
    });
    it("should set the schema", () => {
      expect(this.store.get("modelStrict")).to.deep.eq(true);
    });
  });
});
