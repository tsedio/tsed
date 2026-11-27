import {parseSegment} from "./parseSegment.js";
import {segmentsToTokens} from "./segmentsToTokens.js";

const tokens = (...segments: string[]) => segmentsToTokens(segments.map(parseSegment));

describe("segmentsToTokens", () => {
  it("should return no token for the root", () => {
    expect(tokens()).toEqual([]);
  });

  it("should merge static segments into one text", () => {
    expect(tokens("users", "list")).toEqual(["users/list"]);
  });

  it("should split static text around parameters keeping separators", () => {
    expect(tokens("users", ":id", "posts")).toEqual(["users/", {type: "param", name: "id", optional: false}, "/posts"]);
  });

  it("should not emit an empty text when starting with a parameter", () => {
    expect(tokens(":id", "x")).toEqual([{type: "param", name: "id", optional: false}, "/x"]);
  });

  it("should keep the separator before a trailing wildcard", () => {
    expect(tokens("files", "*")).toEqual(["files/", {type: "wildcard", name: "*"}]);
  });

  it("should chain parameters through their separator", () => {
    expect(tokens(":a", ":b")).toEqual([{type: "param", name: "a", optional: false}, "/", {type: "param", name: "b", optional: false}]);
  });
});
