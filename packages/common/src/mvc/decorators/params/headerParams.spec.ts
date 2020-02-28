import {HeaderParams, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@HeaderParams", () => {
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Ctrl {
      test(@HeaderParams("expression") header: string) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.HEADER);
  });
});
