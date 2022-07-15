import {mapParamsOptions} from "./mapParamsOptions";

class Test {}

describe("mapParamsOptions", () => {
  it("should return default params when params is empty", () => {
    expect(mapParamsOptions([])).toEqual({useType: undefined, expression: undefined});
  });

  it("should return default params when params have an expression", () => {
    expect(mapParamsOptions(["expression"])).toEqual({expression: "expression"});
  });

  it("should return default params when params have an expression and usetype", () => {
    expect(mapParamsOptions(["expression", Test])).toEqual({expression: "expression", useType: Test});
  });

  it("should return default params when params have an useType", () => {
    expect(mapParamsOptions([Test])).toEqual({useType: Test});
  });

  it("should return default params when params have an object", () => {
    expect(mapParamsOptions([{expression: "expression", useType: Test}])).toEqual({
      expression: "expression",
      useType: Test
    });
  });
});
