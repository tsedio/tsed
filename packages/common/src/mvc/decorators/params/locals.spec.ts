import {Locals, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@Locals", () => {
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Ctrl {
      test(@Locals("expression") test: any) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.LOCALS);
  });
});
