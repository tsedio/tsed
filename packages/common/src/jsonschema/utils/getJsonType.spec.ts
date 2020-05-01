import {deleteSchema, getJsonType} from "@tsed/common";
import {expect} from "chai";

describe("getJsonType()", () => {
  it("should return number", () => {
    expect(getJsonType(Number)).to.eq("number");
  });

  it("should return string", () => {
    expect(getJsonType(String)).to.eq("string");
  });

  it("should return boolean", () => {
    expect(getJsonType(Boolean)).to.eq("boolean");
  });

  it("should return array", () => {
    expect(getJsonType(Array)).to.eq("array");
  });

  it("should return string when date is given", () => {
    expect(getJsonType(Date)).to.eq("string");
  });

  it("should return object", () => {
    expect(getJsonType({})).to.eq("object");
  });

  it("should return object when class is given", () => {
    expect(getJsonType(class {})).to.eq("object");
  });

  it("should return [string] when an array is given", () => {
    expect(getJsonType(["string"])).to.deep.eq(["string"]);
  });
  it("should return string when an string is given", () => {
    expect(getJsonType("string")).to.deep.eq("string");
  });

  it("should delete a schema", () => {
    class Test {}

    getJsonType(Test);
    deleteSchema(Test);
  });
});
