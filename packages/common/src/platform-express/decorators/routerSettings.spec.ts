import {CaseSensitive, MergeParams, Strict} from "@tsed/common";
import {Store} from "@tsed/core";
import {expect} from "chai";

class Test {}

describe("RouterSettings", () => {
  describe("MergeParams", () => {
    it("should call merge method for mergeParams options", () => {
      MergeParams(true)(Test);
      const store = Store.from(Test).get("routerOptions");
      expect(store.mergeParams).to.eq(true);
    });
  });

  describe("CaseSensitive", () => {
    it("should call merge method for mergeParams options", () => {
      CaseSensitive(true)(Test);
      const store = Store.from(Test).get("routerOptions");
      expect(store.caseSensitive).to.eq(true);
    });
  });

  describe("Strict", () => {
    it("should call merge method for mergeParams options", () => {
      Strict(true)(Test);
      const store = Store.from(Test).get("routerOptions");
      expect(store.strict).to.eq(true);
    });
  });
});
