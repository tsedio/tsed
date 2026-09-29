import {trimTrailingSlashes} from "./trimTrailingSlashes.js";

describe("trimTrailingSlashes", () => {
  it("should return the path length without trailing slashes", () => {
    expect(trimTrailingSlashes("/users//")).toBe(6);
  });

  it("should return the length when there is no trailing slash", () => {
    expect(trimTrailingSlashes("/users")).toBe(6);
  });

  it("should return 0 for a path made of slashes only", () => {
    expect(trimTrailingSlashes("///")).toBe(0);
    expect(trimTrailingSlashes("")).toBe(0);
  });
});
