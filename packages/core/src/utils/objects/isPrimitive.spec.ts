import {isPrimitive, isPrimitiveClass} from "@tsed/core";

describe("isPrimitive", () => {
  it("should test if an variable content is a primitive", () => {
    expect(isPrimitive("1")).toEqual(true);
    expect(isPrimitive(1)).toEqual(true);
    expect(isPrimitive(true)).toEqual(true);
    expect(isPrimitive({})).toEqual(false);
  });

  it("should test if a class is String, Number or Boolean", () => {
    expect(isPrimitiveClass(String)).toEqual(true);
    expect(isPrimitiveClass(Number)).toEqual(true);
    expect(isPrimitiveClass(Boolean)).toEqual(true);
    expect(isPrimitiveClass(Date)).toEqual(false);
  });
});
