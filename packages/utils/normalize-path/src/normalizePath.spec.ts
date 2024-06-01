import {normalizePath} from "./normalizePath.js";

describe("normalizePath", () => {
  it("should normalize path (string)", () => {
    expect(normalizePath("path", "to", "img")).toBe("path/to/img");
  });

  it("should normalize path (array)", () => {
    expect(normalizePath(["path/to/img", {}])).toEqual(["path/to/img", {}]);
  });
});
