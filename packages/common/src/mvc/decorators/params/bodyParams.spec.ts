import {BodyParams, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@BodyParams", () => {
  it("should call useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@BodyParams("expression", Test) body: Test) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.BODY);
    param.type.should.eq(Test);
  });
});
