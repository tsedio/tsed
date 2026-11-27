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

  describe("path edge cases", () => {
    it("should stop on a protected key in the middle of the path", () => {
      const obj: any = {};

      setValue(obj, "a.__proto__.polluted", "vulnerable");

      expect(obj).toEqual({a: {}});
      expect(({} as any).polluted).toBeUndefined();
    });

    it("should stop on constructor and prototype keys", () => {
      const obj: any = {};

      setValue(obj, "constructor.prototype.polluted", "vulnerable");
      setValue(obj, "a.prototype", "vulnerable");

      expect(({} as any).polluted).toBeUndefined();
      expect(obj).toEqual({a: {}});
    });

    it("should support a custom separator", () => {
      const obj: any = {};

      setValue(obj, "a/b", 1, "/");

      expect(obj).toEqual({a: {b: 1}});
    });

    it("should keep an existing truthy value and replace a falsy one", () => {
      const obj: any = {a: {c: 1}, b: 0};

      setValue(obj, "a.d", 2);
      setValue(obj, "b.c", 3);

      expect(obj).toEqual({a: {c: 1, d: 2}, b: {c: 3}});
    });

    it("should set an empty key", () => {
      const obj: any = {};

      setValue(obj, "", 1);

      expect(obj).toEqual({"": 1});
    });
  });
});
