import {isBuffer} from "./isBuffer";

describe("isBuffer", () => {
  it("should return true", () => {
    expect(isBuffer(Buffer.from(""))).toBeTruthy();
    expect(isBuffer(Buffer)).toBeTruthy();
  });
  it("should return false", () => {
    expect(isBuffer({})).toBeFalsy();
    expect(isBuffer(undefined)).toBeFalsy();
  });
});
