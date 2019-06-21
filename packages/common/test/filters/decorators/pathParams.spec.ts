import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, PathParams} from "../../../src/filters";
import {PathParamsFilter} from "../../../src/filters/components/PathParamsFilter";

const sandbox = Sinon.createSandbox();
describe("@PathParams", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Test {
    }

    class Ctrl {
      test(@PathParams("expression", Test) header: Test) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(PathParamsFilter, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0,
      expression: "expression",
      useType: Test,
      paramType: ParamTypes.PATH
    });
  });
});
