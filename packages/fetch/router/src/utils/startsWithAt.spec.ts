import {startsWithAt} from "./startsWithAt.js";

describe("startsWithAt", () => {
  it("should match a short prefix at the index", () => {
    expect(startsWithAt("/users/me", "me", 7)).toBe(true);
    expect(startsWithAt("/users/me", "mx", 7)).toBe(false);
  });

  it("should match a long prefix at the index", () => {
    expect(startsWithAt("/static/static/static", "static/static", 1)).toBe(true);
    expect(startsWithAt("/static/static/static", "static/stat1c", 1)).toBe(false);
  });

  it("should not match a prefix found later in the path", () => {
    expect(startsWithAt("/xx/static/static", "static/static", 1)).toBe(false);
    expect(startsWithAt("/xx/ab", "ab", 1)).toBe(false);
  });

  it("should not match past the end of the path", () => {
    expect(startsWithAt("/stat", "static", 1)).toBe(false);
    expect(startsWithAt("/ab", "abc", 1)).toBe(false);
  });

  it("should match an empty prefix", () => {
    expect(startsWithAt("/a", "", 1)).toBe(true);
  });

  it("should agree with String#startsWith", () => {
    const path = "/api/v1/users/42/posts";

    for (let index = 0; index <= path.length; index++) {
      for (const prefix of ["a", "ap", "api/", "api/v1", "users/42", "posts", "/", "42/p", "zz"]) {
        expect(startsWithAt(path, prefix, index)).toBe(path.startsWith(prefix, index));
      }
    }
  });
});
