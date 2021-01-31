import {expect} from "chai";
import {normalizePath} from "./normalizePath";

describe("normalizePath", () => {
  it("should normalize path (string)", () => {
    expect(normalizePath("path", "to", "img")).to.equal("path/to/img");
  });

  it("should normalize path (array)", () => {
    expect(normalizePath(["path/to/img", {}])).to.deep.equal(["path/to/img", {}]);
  });
});
