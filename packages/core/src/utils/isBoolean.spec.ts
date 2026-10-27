import {isBoolean, isBooleanOrBooleanClass} from "./isBoolean.js";

describe("isBoolean", () => {
  it("should return true for boolean primitives", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it("should return false for the Boolean constructor", () => {
    expect(isBoolean(Boolean)).toBe(false);
  });

  it("should return false for boxed booleans", () => {
    expect(isBoolean(new Boolean(true))).toBe(false);
    expect(isBoolean(new Boolean(false))).toBe(false);
  });

  it.each([["true"], [1], [0], [null], [undefined], [{}], [[]]])("should return false for %j", (value) => {
    expect(isBoolean(value)).toBe(false);
  });
});

describe("isBooleanOrBooleanClass", () => {
  it.each([[true], [false], [Boolean], [new Boolean(false)]])("should return true for %s", (value) => {
    expect(isBooleanOrBooleanClass(value)).toBe(true);
  });

  it.each([["true"], [1], [String]])("should return false for %s", (value) => {
    expect(isBooleanOrBooleanClass(value)).toBe(false);
  });
});
