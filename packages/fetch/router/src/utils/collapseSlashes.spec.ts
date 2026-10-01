import {collapseSlashes} from "./collapseSlashes.js";

describe("collapseSlashes", () => {
  it("should return a path without duplicated slashes untouched", () => {
    const path = "/users/1";

    expect(collapseSlashes(path)).toBe(path);
  });

  it("should collapse runs of slashes", () => {
    expect(collapseSlashes("//users///1//")).toBe("/users/1/");
    expect(collapseSlashes("///")).toBe("/");
  });
});
