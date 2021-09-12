import {expect} from "chai";
import {matchPath} from "./matchPath";

describe("matchPath", () => {
  it("should match route with the glob pattern", () => {
    expect(matchPath("/user", ["/user/**"])).to.eq(true);
    expect(matchPath("/user", [])).to.eq(true);
    expect(matchPath("/user")).to.eq(true);
    expect(matchPath("/test", ["!/user/**"])).to.eq(true);
  });

  it("should not match route with the glob pattern", () => {
    const result = matchPath("/test", ["/user/**"]);

    expect(result).to.eq(false);
  });
});
