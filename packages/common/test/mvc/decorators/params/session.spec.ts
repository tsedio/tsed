import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, Session} from "../../../../src/mvc";
import {SessionFilter} from "../../../../src/mvc/components/SessionFilter";

const sandbox = Sinon.createSandbox();
describe("@Session", () => {
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
      test(@Session("expression", Test) body: Test) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.SESSION, {
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
