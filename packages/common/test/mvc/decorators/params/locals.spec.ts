import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {Locals, ParamRegistry, ParamTypes} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@Locals", () => {
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
      test(@Locals("expression") test: any) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.LOCALS, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      index: 0,
      expression: "expression",
      useType: undefined,
      useConverter: false,
      useValidation: false
    });
  });
});
