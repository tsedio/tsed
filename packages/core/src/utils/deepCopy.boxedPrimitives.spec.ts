import {deepClone} from "./deepClone.js";
import {deepMerge} from "./deepMerge.js";

describe("deepClone() with boxed primitives", () => {
  it("should copy a boxed boolean into a new Boolean object", () => {
    const source = new Boolean(false);
    const clone = deepClone(source);

    expect(clone).toBeInstanceOf(Boolean);
    expect(clone.valueOf()).toBe(false);
    expect(clone).not.toBe(source);
  });

  it("should copy boxed numbers and strings", () => {
    const number = deepClone(new Number(42));
    const string = deepClone(new String("a"));

    expect(number).toBeInstanceOf(Number);
    expect(number.valueOf()).toBe(42);
    expect(string).toBeInstanceOf(String);
    expect(string.valueOf()).toBe("a");
  });

  it("should copy a nested boxed primitive", () => {
    const clone = deepClone({flag: new Boolean(true)});

    expect(clone.flag).toBeInstanceOf(Boolean);
    expect(clone.flag.valueOf()).toBe(true);
  });

  it("should keep constructors and primitives unchanged", () => {
    expect(deepClone(Boolean)).toBe(Boolean);
    expect(deepClone(true)).toBe(true);
    expect(deepClone("a")).toBe("a");
  });
});

describe("deepMerge() with boxed primitives", () => {
  it("should use a boxed boolean as a leaf value", () => {
    const value = new Boolean(false);
    const result = deepMerge({flag: true}, {flag: value});

    expect(result!.flag).toBe(value);
    expect(result!.flag.valueOf()).toBe(false);
  });

  it("should use boxed numbers and strings as leaf values", () => {
    const number = new Number(2);
    const string = new String("b");

    expect(deepMerge({value: 1}, {value: number})!.value).toBe(number);
    expect(deepMerge({value: "a"}, {value: string})!.value).toBe(string);
  });
});
