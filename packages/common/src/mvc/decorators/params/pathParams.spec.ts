import {ParamRegistry, ParamTypes, PathParams, RawPathParams} from "../../../../src/mvc";

describe("@PathParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@PathParams("expression", Test) header: Test) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.PATH);
    param.type.should.eq(Test);
  });
  it("should call ParamFilter.useParam method with the correct parameters (raw)", () => {
    class Ctrl {
      test(@RawPathParams("expression") header: string) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.PATH);
  });
});
