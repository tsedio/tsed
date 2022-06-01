import {defaultErrorFormatter} from "./defaultErrorFormatter";

describe("defaultErrorFormatter", () => {
  it("should extract data and format error", () => {
    expect(
      defaultErrorFormatter({
        keyword: "maximum",
        dataPath: "/length",
        schemaPath: "#/properties/length/maximum",
        params: {comparison: "<=", limit: 250},
        message: "should be <= 250",
        data: 251,
        modelName: "RandomStringModel"
      } as any)
    ).toEqual("RandomStringModel.length should be <= 250. Given value: 251");
  });
  it("should etract data and format error(2)", () => {
    expect(
      defaultErrorFormatter({
        instancePath: "/length",
        schemaPath: "#/properties/length/maximum",
        keyword: "maximum",
        params: {comparison: "<=", limit: 250},
        message: "must be <= 250",
        data: {length: 251},
        modelName: "RandomStringModel"
      } as any)
    ).toEqual('RandomStringModel.length must be <= 250. Given value: {"length":251}');
  });
});
