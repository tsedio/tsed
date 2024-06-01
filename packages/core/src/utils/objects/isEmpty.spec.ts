import {isEmpty} from "./isEmpty.js";

describe("isEmpty", () => {
  it("should return true", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty("")).toBe(true);
  });
});
