import {expect} from "chai";
import {isProtectedKey} from "./isProtectedKey";

describe("isProtectedKey", () => {
  it("should return true", () => {
    expect(isProtectedKey("__proto__")).to.eq(true);
    expect(isProtectedKey("prototype")).to.eq(true);
    expect(isProtectedKey("constructor")).to.eq(true);
  });
  it("should return false", () => {
    expect(isProtectedKey("test")).to.eq(false);
    expect(isProtectedKey("pro")).to.eq(false);
    expect(isProtectedKey("const")).to.eq(false);
  });
});
