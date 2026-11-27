import {createParams} from "./createParams.js";

describe("createParams", () => {
  it("should return an empty object without names", () => {
    expect(createParams([], undefined, undefined, undefined, undefined, null)).toEqual({});
  });

  it("should pair names with the first four values", () => {
    expect(createParams(["a", "b", "c", "d"], "1", "2", "3", "4", null)).toEqual({a: "1", b: "2", c: "3", d: "4"});
  });

  it("should read further values from the extra array", () => {
    expect(createParams(["a", "b", "c", "d", "e", "f"], "1", "2", "3", "4", ["5", "6"])).toEqual({
      a: "1",
      b: "2",
      c: "3",
      d: "4",
      e: "5",
      f: "6"
    });
  });

  it("should only use the values matching the names", () => {
    expect(createParams(["a"], "1", "stale", "stale", "stale", null)).toEqual({a: "1"});
  });

  it("should keep a param named __proto__ as an own property", () => {
    const params = createParams(["__proto__", "id"], "value", "1", undefined, undefined, null);

    expect(Object.hasOwn(params, "__proto__")).toBe(true);
    expect(params.__proto__).toBe("value");
    expect(params.id).toBe("1");
    expect(Object.getPrototypeOf(params)).toBe(Object.prototype);
  });
});
