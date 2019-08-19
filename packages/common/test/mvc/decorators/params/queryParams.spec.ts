import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, QueryParams} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@QueryParams", () => {
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
      test(@QueryParams("expression", Test) header: Test) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.QUERY, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      index: 0,
      expression: "expression",
      useType: Test,
      useConverter: true,
      useValidation: true
    });
  });
});
