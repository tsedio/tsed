import {matchPath} from "./matchPath";

describe("matchPath", () => {
  it("should match route with the glob pattern", () => {
    expect(matchPath("/user", ["/user/**"])).toBe(true);
    expect(matchPath("/user", [])).toBe(true);
    expect(matchPath("/user")).toBe(true);
    expect(matchPath("/test", ["!/user/**"])).toBe(true);
  });

  it("should not match route with the glob pattern", () => {
    const result = matchPath("/test", ["/user/**"]);

    expect(result).toBe(false);
  });
});
