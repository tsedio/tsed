import {ROUTER_OPTIONS} from "@tsed/common";
import {Store} from "@tsed/core";
import {CaseSensitive, Strict} from "@tsed/platform-koa";

class Test {}

describe("RouterSettings", () => {
  describe("CaseSensitive", () => {
    it("should call merge method for mergeParams options", () => {
      CaseSensitive(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.sensitive).toEqual(true);
    });
  });

  describe("Strict", () => {
    it("should call merge method for mergeParams options", () => {
      Strict(true)(Test);
      const store = Store.from(Test).get(ROUTER_OPTIONS);
      expect(store.strict).toEqual(true);
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
