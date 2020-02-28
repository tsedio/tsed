import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, PathParams} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@PathParams", () => {
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@PathParams("expression", Test) header: Test) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.PATH);
    param.type.should.eq(Test);
  });
});
