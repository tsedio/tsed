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

  it("should decode escapes at the start, the end and in a row", () => {
    expect(decodePathSegment("%2Bparam")).toBe("+param");
    expect(decodePathSegment("param%2B")).toBe("param+");
    expect(decodePathSegment("%41%42%43")).toBe("ABC");
    expect(decodePathSegment("a%2fb")).toBe("a/b");
  });

  it("should decode UTF-8 sequences", () => {
    expect(decodePathSegment("caf%C3%A9")).toBe("café");
    expect(decodePathSegment("a%20caf%C3%A9")).toBe("a café");
  });

  it("should return the segment as is on an invalid escape", () => {
    expect(decodePathSegment("a%2")).toBe("a%2");
    expect(decodePathSegment("a%zzb")).toBe("a%zzb");
    expect(decodePathSegment("100%")).toBe("100%");
    expect(decodePathSegment("%C3")).toBe("%C3");
  });

  it("should match decodeURIComponent on every ASCII escape", () => {
    for (let code = 0; code < 128; code++) {
      const escaped = "x%" + code.toString(16).padStart(2, "0") + "y";

      expect(decodePathSegment(escaped)).toBe(decodeURIComponent(escaped));
      expect(decodePathSegment(escaped.toUpperCase())).toBe(decodeURIComponent(escaped.toUpperCase()));
    }
  });
});
