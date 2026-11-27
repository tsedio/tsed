import {splitPattern} from "./splitPattern.js";

describe("splitPattern", () => {
  it("should split a pattern into segments", () => {
    expect(splitPattern("/users/:id/posts")).toEqual(["users", ":id", "posts"]);
  });

  it("should drop the leading and a single trailing slash", () => {
    expect(splitPattern("/users/:id/")).toEqual(["users", ":id"]);
  });

  it("should keep internal empty segments, like Express 5", () => {
    expect(splitPattern("/a//b")).toEqual(["a", "", "b"]);
    expect(splitPattern("//users//:id/")).toEqual(["", "users", "", ":id"]);
  });

  it("should return no segment for the root", () => {
    expect(splitPattern("/")).toEqual([]);
    expect(splitPattern("")).toEqual([]);
  });
});
