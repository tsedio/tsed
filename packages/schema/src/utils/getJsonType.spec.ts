import {getJsonType} from "@tsed/schema";
import {expect} from "chai";

describe("getJsonType", () => {
  it("should return file", () => {
    expect(getJsonType("file")).to.eq("file");
  });
  it("should return generic", () => {
    expect(getJsonType("test")).to.eq("generic");
  });
  it("should return ['generic']", () => {
    expect(getJsonType(["test"])).to.deep.eq(["generic"]);
  });
  it("should return array", () => {
    expect(getJsonType(Array)).to.eq("array");
  });
  it("should return string", () => {
    expect(getJsonType(new Date())).to.eq("string");
  });
  it("should return object", () => {
    expect(getJsonType({test: "test"})).to.eq("object");
  });
  it("should return null", () => {
    expect(getJsonType(null)).to.eq("null");
  });
  it("should return number", () => {
    expect(getJsonType(5)).to.eq("number");
  });
});
