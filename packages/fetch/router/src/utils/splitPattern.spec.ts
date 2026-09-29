import {splitPattern} from "./splitPattern.js";

describe("splitPattern", () => {
  it("should split a pattern into segments", () => {
    expect(splitPattern("/users/:id/posts")).toEqual(["users", ":id", "posts"]);
  });

  it("should drop empty segments", () => {
    expect(splitPattern("//users//:id/")).toEqual(["users", ":id"]);
  });

  it("should return no segment for the root", () => {
    expect(splitPattern("/")).toEqual([]);
    expect(splitPattern("")).toEqual([]);
  });
});
