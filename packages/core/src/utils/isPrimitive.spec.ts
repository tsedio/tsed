import {isClass} from "./isClass.js";
import {isPrimitive, isPrimitiveClass, isPrimitiveOrPrimitiveClass} from "./isPrimitive.js";

describe("isPrimitive", () => {
  it("should test if an variable content is a primitive", () => {
    expect(isPrimitive("1")).toEqual(true);
    expect(isPrimitive(1)).toEqual(true);
    expect(isPrimitive(true)).toEqual(true);
    expect(isPrimitive({})).toEqual(false);
  });

  it.each([[""], ["text"], [0], [NaN], [42], [true], [false]])("should return true for the primitive %s", (value) => {
    expect(isPrimitive(value)).toBe(true);
  });

  it.each([[String], [Number], [Boolean]])("should return false for the constructor %o", (value) => {
    expect(isPrimitive(value)).toBe(false);
  });

  it.each([[new String("a")], [new Number(1)], [new Boolean(false)]])("should return false for the boxed value %o", (value) => {
    expect(isPrimitive(value)).toBe(false);
  });

  it.each([[null], [undefined], [Symbol("s")], [BigInt(1)], [{}], [[]], [new Date()], [class Model {}]])(
    "should return false for the non-primitive %o",
    (value) => {
      expect(isPrimitive(value)).toBe(false);
    }
  );

  it("should test if a class is String, Number or Boolean", () => {
    expect(isPrimitiveClass(String)).toEqual(true);
    expect(isPrimitiveClass(Number)).toEqual(true);
    expect(isPrimitiveClass(Boolean)).toEqual(true);
    expect(isPrimitiveClass(Date)).toEqual(false);
  });
});

describe("isPrimitiveOrPrimitiveClass", () => {
  it.each([[Boolean], [new Boolean(false)], [String], [new Number(1)]])("should return true for %o", (value) => {
    expect(isPrimitiveOrPrimitiveClass(value)).toBe(true);
  });

  it.each([[Boolean], [String], [Number]])("should keep isClass(%o) false", (value) => {
    expect(isClass(value)).toBe(false);
  });
});
