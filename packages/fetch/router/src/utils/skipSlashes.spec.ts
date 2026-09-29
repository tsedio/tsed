import {skipSlashes} from "./skipSlashes.js";

describe("skipSlashes", () => {
  it("should skip consecutive leading slashes", () => {
    expect(skipSlashes("//users", 0)).toBe(2);
  });

  it("should return the same index when there is no slash", () => {
    expect(skipSlashes("/users", 1)).toBe(1);
  });

  it("should stop at the end of the path", () => {
    expect(skipSlashes("///", 0)).toBe(3);
    expect(skipSlashes("", 0)).toBe(0);
  });
});
