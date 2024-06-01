import {getJsonType} from "./getJsonType.js";

describe("getJsonType", () => {
  it("should return file", () => {
    expect(getJsonType("file")).toBe("file");
  });
  it("should return generic", () => {
    expect(getJsonType("test")).toBe("generic");
  });
  it("should return ['generic']", () => {
    expect(getJsonType(["test"])).toEqual(["generic"]);
  });
  it("should return array", () => {
    expect(getJsonType(Array)).toBe("array");
  });
  it("should return string", () => {
    expect(getJsonType(new Date())).toBe("string");
  });
  it("should return object", () => {
    expect(getJsonType({test: "test"})).toBe("object");
  });
  it("should return null", () => {
    expect(getJsonType(null)).toBe("null");
  });
  it("should return number", () => {
    expect(getJsonType(5)).toBe("number");
  });
});
