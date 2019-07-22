import {mapParamsOptions} from "../../../../src/filters/decorators/utils/mapParamsOptions";

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

  it("should return default params when params have an useType fn", () => {
    const fn = () => Test;
    mapParamsOptions([fn]).should.deep.eq({useType: fn});
  });

  it("should return default params when params have an expression and useType fn", () => {
    const fn = () => Test;
    mapParamsOptions(["expression", fn]).should.deep.eq({expression: "expression", useType: fn});
  });

  it("should return default params when params have an object", () => {
    const fn = () => Test;
    mapParamsOptions([{expression: "expression", useType: fn}]).should.deep.eq({expression: "expression", useType: fn});
  });
});
