import {expect} from "chai";
import {setValue} from "../../src";

describe("setValue()", () => {
  describe("when map", () => {
    let map: Map<any, any>;
    before(() => {
      map = new Map();

      setValue(map, "test", "value");
    });

    it("should set value", () => {
      expect(map.get("test")).to.eq("value");
    });
  });

  describe("when map with dep", () => {
    let map: Map<any, any>;
    before(() => {
      map = new Map();
      map.set("test", {t1: "value"});
      setValue(map, "test.t1", "value2");
    });

    it("should set value", () => {
      expect(map.get("test").t1).to.eq("value2");
    });
  });

  describe("when map with dep (without defined value)", () => {
    let map: Map<any, any>;
    before(() => {
      map = new Map();
      setValue(map, "test.t1", "value2");
    });

    it("should set value", () => {
      expect(map.get("test").t1).to.eq("value2");
    });
  });

  describe("when object with dep (without defined value)", () => {
    const map: any = {test: {t1: "value"}};
    before(() => {
      setValue(map, "test.t1", "value2");
    });

    it("should set value", () => {
      expect(map.test.t1).to.eq("value2");
    });
  });

  describe("when object with dep (without defined value)", () => {
    it("should set value", () => {
      const obj = {};
      setValue(obj, "__proto__", "vulnerable");
      expect(obj).to.deep.eq({});
      expect(({} as any).a).to.eq(undefined);
    });
  });
});
