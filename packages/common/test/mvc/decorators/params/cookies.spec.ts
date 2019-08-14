import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {Cookies, ParamRegistry, ParamTypes} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@Cookies", () => {
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
      test(@Cookies("expression", Test) body: Test) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.COOKIES, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      index: 0,
      expression: "expression",
      useType: Test,
      useConverter: false,
      useValidation: false
    });
  });
});
