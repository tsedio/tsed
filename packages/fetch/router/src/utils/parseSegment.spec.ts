import {parseSegment} from "./parseSegment.js";

describe("parseSegment", () => {
  it("should parse a static segment", () => {
    expect(parseSegment("users")).toEqual({type: "static", value: "users"});
  });

  it("should parse a named parameter", () => {
    expect(parseSegment(":id")).toEqual({type: "param", name: "id", optional: false});
  });

  it("should parse an optional parameter with the ? syntax", () => {
    expect(parseSegment(":id?")).toEqual({type: "param", name: "id", optional: true});
  });

  it("should parse an optional parameter with the {:param} syntax", () => {
    expect(parseSegment("{:id}")).toEqual({type: "param", name: "id", optional: true});
  });

  it("should parse the simple and regexp wildcards", () => {
    expect(parseSegment("*")).toEqual({type: "wildcard", name: "*"});
    expect(parseSegment("(.*)")).toEqual({type: "wildcard", name: "*"});
  });

  it("should parse a named wildcard", () => {
    expect(parseSegment(":path*")).toEqual({type: "wildcard", name: "path"});
  });

  it("should reject an empty parameter name", () => {
    expect(() => parseSegment(":")).toThrow("Empty parameter name");
    expect(() => parseSegment(":?")).toThrow("Empty parameter name");
    expect(() => parseSegment(":*")).toThrow("Empty parameter name");
    expect(() => parseSegment("{:}")).toThrow("Empty parameter name");
  });
});
