import {isNil} from "./isNil";

describe("isNil", () => {
  it("should return true", () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(1)).toBe(false);
    expect(isNil("")).toBe(false);
  });
});
