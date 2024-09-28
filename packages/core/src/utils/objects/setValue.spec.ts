import {setValue} from "./setValue.js";

describe("setValue()", () => {
  describe("when map", () => {
    it("should set value", () => {
      let map: Map<any, any> = new Map();

      setValue(map, "test", "value");

      expect(map.get("test")).toBe("value");
    });
  });

  describe("when map with dep", () => {
    it("should set value", () => {
      let map: Map<any, any> = new Map();
      map.set("test", {t1: "value"});
      setValue(map, "test.t1", "value2");

      expect(map.get("test").t1).toBe("value2");
    });
  });

  describe("when map with dep (without defined value)", () => {
    it("should set value", () => {
      let map: Map<any, any> = new Map();
      setValue(map, "test.t1", "value2");

      expect(map.get("test").t1).toBe("value2");
    });
  });

  describe("when object with dep (without defined value)", () => {
    it("should set value", () => {
      const map: any = {test: {t1: "value"}};
      setValue(map, "test.t1", "value2");

      expect(map.test.t1).toBe("value2");
    });
  });

  describe("when object with dep (with object defined value)", () => {
    it("should set value", () => {
      const obj = {};
      setValue(obj, "__proto__", "vulnerable");
      expect(obj).toEqual({});
      expect(({} as any).a).toBeUndefined();
    });
  });

  describe("when a function is given a value", () => {
    it("should set value", () => {
      let map: any = {};

      setValue(map, "test.deep", () => {});

      expect(map.test.deep).toBeInstanceOf(Function);
    });
  });
});
