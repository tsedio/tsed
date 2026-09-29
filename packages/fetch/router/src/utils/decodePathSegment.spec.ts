import {decodePathSegment} from "./decodePathSegment.js";

describe("decodePathSegment", () => {
  it("should return a segment without escapes untouched", () => {
    expect(decodePathSegment("abc")).toBe("abc");
  });

  it("should decode percent-encoded sequences", () => {
    expect(decodePathSegment("a%20b%2Fc")).toBe("a b/c");
  });

  it("should return a malformed sequence as is", () => {
    expect(decodePathSegment("%E0%A4%A")).toBe("%E0%A4%A");
  });
});
