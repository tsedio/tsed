import {expect} from "chai";
import {ParamRegistry, ParamTypes} from "@tsed/common";
import {Context} from "./context";

describe("@Context ", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@Context("expression") test: any) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.CONTEXT);
  });
});
