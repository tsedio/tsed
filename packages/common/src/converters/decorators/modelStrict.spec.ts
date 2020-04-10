import {Store} from "@tsed/core";
import {expect} from "chai";
import {ModelStrict} from "../../../src/converters";

describe("ModelStrict", () => {
  describe("string type", () => {
    it("should set the schema", () => {
      @ModelStrict(true)
      class Test {}

      const store = Store.from(Test);

      expect(store.get("modelStrict")).to.deep.eq(true);
    });
  });
});
