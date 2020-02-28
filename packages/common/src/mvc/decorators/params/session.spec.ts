import {ParamRegistry, ParamTypes, Session} from "../../../../src/mvc";

describe("@Session", () => {
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@Session({expression: "expression", useType: Test}) body: Test) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.SESSION);
    param.type.should.eq(Test);
  });
});
