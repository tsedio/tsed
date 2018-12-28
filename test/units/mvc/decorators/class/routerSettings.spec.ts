import {CaseSensitive, MergeParams, Strict} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";

class Test {}

describe("RouterSettings", () => {
  describe("MergeParams", () => {
    before(() => {
      MergeParams(true)(Test);
      this.store = Store.from(Test).get("routerOptions");
    });

    after(() => {});

    it("should call merge method for mergeParams options", () => {
      expect(this.store.mergeParams).to.eq(true);
    });
  });

  describe("CaseSensitive", () => {
    before(() => {
      CaseSensitive(true)(Test);
      this.store = Store.from(Test).get("routerOptions");
    });

    after(() => {});

    it("should call merge method for mergeParams options", () => {
      expect(this.store.caseSensitive).to.eq(true);
    });
  });

  describe("Strict", () => {
    before(() => {
      Strict(true)(Test);
      this.store = Store.from(Test).get("routerOptions");
    });

    after(() => {});

    it("should call merge method for mergeParams options", () => {
      expect(this.store.strict).to.eq(true);
    });
  });
});
