import {expandOptionalSegments} from "./expandOptionalSegments.js";
import {parseSegment} from "./parseSegment.js";

const parse = (...segments: string[]) => segments.map(parseSegment);

describe("expandOptionalSegments", () => {
  it("should return the segments untouched without optional parameter", () => {
    expect(expandOptionalSegments(parse("users", ":id"))).toEqual([parse("users", ":id")]);
  });

  it("should return one empty variant for an empty list", () => {
    expect(expandOptionalSegments([])).toEqual([[]]);
  });

  it("should expand an optional parameter into with and without variants", () => {
    expect(expandOptionalSegments(parse("users", ":id?"))).toEqual([parse("users", ":id"), parse("users")]);
  });

  it("should expand several optional parameters", () => {
    const variants = expandOptionalSegments(parse(":a?", "x", "{:b}"));

    expect(variants).toHaveLength(4);
    expect(variants).toContainEqual(parse(":a", "x", ":b"));
    expect(variants).toContainEqual(parse(":a", "x"));
    expect(variants).toContainEqual(parse("x", ":b"));
    expect(variants).toContainEqual(parse("x"));
  });
});
