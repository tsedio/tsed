import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, QueryParams} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@QueryParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@QueryParams("expression", Test) header: Test) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.QUERY);
    param.type.should.eq(Test);
  });
});
