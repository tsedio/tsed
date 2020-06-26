import {expect} from "chai";
import {HeaderParams, ParamRegistry, ParamTypes} from "../../../../src/mvc";

describe("@HeaderParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@HeaderParams("expression") header: string) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.HEADER);
  });
});
