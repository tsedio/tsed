import {ParamRegistry, ParamTypes} from "@tsed/common";
import {Context} from "./context";

describe("@Context ", () => {
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Ctrl {
      test(@Context("expression") test: any) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.CONTEXT);
  });
});
