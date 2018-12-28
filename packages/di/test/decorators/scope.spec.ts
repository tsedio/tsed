import {Store} from "@tsed/core";
import {expect} from "chai";
import {Scope} from "../../src/decorators/scope";

class Test {
}

describe("Scope", () => {
  describe("when parameters is given", () => {
    before(() => {
      Scope("request")(Test);
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("scope")).to.eq("request");
    });
  });

  describe("when parameters is not given", () => {
    before(() => {
      Scope()(Test);
      this.store = Store.from(Test);
    });

    it("should set metadata", () => {
      expect(this.store.get("scope")).to.eq("request");
    });
  });
});
