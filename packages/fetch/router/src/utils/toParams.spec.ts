import {toParams} from "./toParams.js";

describe("toParams", () => {
  it("should pair names with values", () => {
    expect(toParams(["id", "postId"], ["1", "2"])).toEqual({id: "1", postId: "2"});
  });

  it("should return an empty object without names", () => {
    expect(toParams([], [])).toEqual({});
  });
});
