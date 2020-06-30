import {expect} from "chai";
import {mapParamsOptions} from "./mapParamsOptions";

class Test {
}

describe("mapParamsOptions", () => {
  it("should return default params when params is empty", () => {
    expect(mapParamsOptions([])).to.deep.eq({useType: undefined, expression: undefined});
  });

  it("should return default params when params have an expression", () => {
    expect(mapParamsOptions(["expression"])).to.deep.eq({expression: "expression"});
  });

  it("should return default params when params have an expression and usetype", () => {
    expect(mapParamsOptions(["expression", Test])).to.deep.eq({expression: "expression", useType: Test});
  });

  it("should return default params when params have an useType", () => {
    expect(mapParamsOptions([Test])).to.deep.eq({useType: Test});
  });

  it("should return default params when params have an object", () => {
    expect(mapParamsOptions([{expression: "expression", useType: Test}])).to.deep.eq({
      expression: "expression",
      useType: Test
    });
  });
});
