import {ROUTER_OPTIONS} from "@tsed/common";
import {Store} from "@tsed/core";
import {CaseSensitive, MergeParams, Strict} from "@tsed/platform-express";
import {expect} from "chai";

class Test {}

describe("RouterSettings", () => {
  describe("MergeParams", () => {
    it("should call merge method for mergeParams options", () => {
      MergeParams(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.mergeParams).to.eq(true);
    });
  });

  describe("CaseSensitive", () => {
    it("should call merge method for mergeParams options", () => {
      CaseSensitive(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.caseSensitive).to.eq(true);
    });
  });

  describe("Strict", () => {
    it("should call merge method for mergeParams options", () => {
      Strict(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.strict).to.eq(true);
    });
  });
});
