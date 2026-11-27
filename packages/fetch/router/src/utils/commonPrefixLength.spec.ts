import {commonPrefixLength} from "./commonPrefixLength.js";

describe("commonPrefixLength", () => {
  it("should return the length of the shared prefix", () => {
    expect(commonPrefixLength("/users/", "/user")).toBe(5);
    expect(commonPrefixLength("/abc", "/abd")).toBe(3);
  });

  it("should return 0 when nothing is shared", () => {
    expect(commonPrefixLength("abc", "xyz")).toBe(0);
    expect(commonPrefixLength("", "xyz")).toBe(0);
  });

  it("should return the shortest length when one string prefixes the other", () => {
    expect(commonPrefixLength("/user", "/users")).toBe(5);
    expect(commonPrefixLength("same", "same")).toBe(4);
  });
});
