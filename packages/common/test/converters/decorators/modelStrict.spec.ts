import {Store} from "@tsed/core";
import {expect} from "chai";
import {ModelStrict} from "../../../src/converters";

class Test {
}

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
