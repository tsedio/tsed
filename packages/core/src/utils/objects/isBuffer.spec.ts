import {isBuffer, isUint8Array} from "./isBuffer";

describe("isBuffer", () => {
  it("should return true", () => {
    expect(isBuffer(Buffer.from(""))).toBeTruthy();
    expect(isBuffer(Buffer)).toBeTruthy();
    expect(isUint8Array(Uint8Array)).toBeTruthy();
    expect(isUint8Array(Uint8Array.from([0, 1]))).toBeTruthy();
  });
  it("should return false", () => {
    expect(isBuffer({})).toBeFalsy();
    expect(isBuffer(undefined)).toBeFalsy();
  });
});
