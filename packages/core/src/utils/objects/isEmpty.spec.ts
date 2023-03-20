import {isEmpty} from "./isEmpty";

describe("isEmpty", () => {
  it("should return true", () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty("")).toBe(true);
  });
});
