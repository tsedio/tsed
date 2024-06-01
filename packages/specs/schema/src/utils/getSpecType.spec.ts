import {SpecTypes} from "../domain/SpecTypes.js";
import {getSpecType, getSpecTypeFromSpec} from "./getSpecType.js";

describe("getSpecType", () => {
  it("should return spect type from version", () => {
    expect(getSpecType("2.0")).toEqual(SpecTypes.SWAGGER);
    expect(getSpecType("3.0.1")).toEqual(SpecTypes.OPENAPI);
  });
});

describe("getSpecTypeFromSpec", () => {
  it("should return spect type from version", () => {
    expect(getSpecTypeFromSpec({swagger: "2.0"})).toEqual(SpecTypes.SWAGGER);
    expect(getSpecTypeFromSpec({openapi: "3.0.1"})).toEqual(SpecTypes.OPENAPI);
  });
});
