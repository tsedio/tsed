import {ROUTER_OPTIONS} from "@tsed/common";
import {Store} from "@tsed/core";
import {CaseSensitive, MergeParams, Strict} from "@tsed/platform-express";

class Test {}

describe("RouterSettings", () => {
  describe("MergeParams", () => {
    it("should call merge method for mergeParams options", () => {
      MergeParams(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.mergeParams).toEqual(true);
    });
  });

  describe("CaseSensitive", () => {
    it("should call merge method for mergeParams options", () => {
      CaseSensitive(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.caseSensitive).toEqual(true);
    });
  });

  describe("Strict", () => {
    it("should call merge method for mergeParams options", () => {
      Strict(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.strict).toEqual(true);
    });
  });
});
