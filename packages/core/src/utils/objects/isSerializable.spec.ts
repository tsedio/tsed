import {isSerializable} from "./isSerializable";

describe("isSerializable()", () => {
  it("should return the expected value", () => {
    expect(isSerializable(true)).toBe(false);
    expect(isSerializable(null)).toBe(false);
    expect(isSerializable(undefined)).toBe(false);
    expect(isSerializable("")).toBe(false);
    expect(isSerializable("test")).toBe(false);
    expect(isSerializable(0)).toBe(false);
    expect(isSerializable(1)).toBe(false);
    expect(isSerializable({})).toBe(true);
  });
});
