import {mapParamsOptions} from "../../../../../src/mvc/decorators/params/utils/mapParamsOptions";

class Test {
}

describe("mapParamsOptions", () => {
  it("should return default params when params is empty", () => {
    mapParamsOptions([]).should.deep.eq({useType: undefined, expression: undefined});
  });

  it("should return default params when params have an expression", () => {
    mapParamsOptions(["expression"]).should.deep.eq({expression: "expression"});
  });

  it("should return default params when params have an expression and usetype", () => {
    mapParamsOptions(["expression", Test]).should.deep.eq({expression: "expression", useType: Test});
  });

  it("should return default params when params have an useType", () => {
    mapParamsOptions([Test]).should.deep.eq({useType: Test});
  });

  it("should return default params when params have an object", () => {
    mapParamsOptions([{expression: "expression", useType: Test}]).should.deep.eq({expression: "expression", useType: Test});
  });
});
