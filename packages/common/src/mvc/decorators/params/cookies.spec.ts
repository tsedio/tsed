import {Cookies, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@Cookies", () => {
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@Cookies("expression", Test) body: Test) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.COOKIES);
    param.type.should.eq(Test);
  });
});
