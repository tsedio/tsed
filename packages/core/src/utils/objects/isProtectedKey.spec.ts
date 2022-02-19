import {isProtectedKey} from "./isProtectedKey";

describe("isProtectedKey", () => {
  it("should return true", () => {
    expect(isProtectedKey("__proto__")).toBe(true);
    expect(isProtectedKey("prototype")).toBe(true);
    expect(isProtectedKey("constructor")).toBe(true);
  });
  it("should return false", () => {
    expect(isProtectedKey("test")).toBe(false);
    expect(isProtectedKey("pro")).toBe(false);
    expect(isProtectedKey("const")).toBe(false);
  });
});
