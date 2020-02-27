import {expect} from "chai";
import {setValue} from "../../src";

describe("setValue()", () => {
  describe("when map", () => {
    let map: Map<any, any>;
    before(() => {
      map = new Map();

      setValue("test", "value", map);
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
      setValue("test.t1", "value2", map);
    });

    it("should set value", () => {
      expect(map.get("test").t1).to.eq("value2");
    });
  });

  describe("when map with dep (without defined value)", () => {
    let map: Map<any, any>;
    before(() => {
      map = new Map();
      setValue("test.t1", "value2", map);
    });

    it("should set value", () => {
      expect(map.get("test").t1).to.eq("value2");
    });
  });

  describe("when object with dep (without defined value)", () => {
    const map: any = {test: {t1: "value"}};
    before(() => {
      setValue("test.t1", "value2", map);
    });

    it("should set value", () => {
      expect(map.test.t1).to.eq("value2");
    });
  });
});
