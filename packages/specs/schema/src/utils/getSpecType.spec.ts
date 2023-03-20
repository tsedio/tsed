import {expect} from "chai";
import {SpecTypes} from "../domain/SpecTypes";
import {getSpecType, getSpecTypeFromSpec} from "./getSpecType";

describe("getSpecType", () => {
  it("should return spect type from version", () => {
    expect(getSpecType("2.0")).to.equal(SpecTypes.SWAGGER);
    expect(getSpecType("3.0.1")).to.equal(SpecTypes.OPENAPI);
  });
});

describe("getSpecTypeFromSpec", () => {
  it("should return spect type from version", () => {
    expect(getSpecTypeFromSpec({swagger: "2.0"})).to.equal(SpecTypes.SWAGGER);
    expect(getSpecTypeFromSpec({openapi: "3.0.1"})).to.equal(SpecTypes.OPENAPI);
  });
});
