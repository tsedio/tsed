import {expect} from "chai";
import {Locals, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@Locals", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@Locals("expression") test: any) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.LOCALS);
  });
});
