import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {BodyParams, ParamRegistry, ParamTypes} from "../../../../src/mvc";
import {BodyParamsFilter} from "../../../../src/mvc/components/BodyParamsFilter";

const sandbox = Sinon.createSandbox();
describe("@BodyParams", () => {
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
      test(@BodyParams("expression", Test) body: Test) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(BodyParamsFilter, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0,
      expression: "expression",
      useType: Test,
      useConverter: true,
      useValidation: true,
      paramType: ParamTypes.BODY
    });
  });
});
