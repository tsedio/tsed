import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {HeaderParams, ParamRegistry, ParamTypes} from "../../../src/filters";
import {HeaderParamsFilter} from "../../../src/filters/components/HeaderParamsFilter";

const sandbox = Sinon.createSandbox();
describe("@HeaderParams", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Ctrl {
      test(@HeaderParams("expression") header: string) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(HeaderParamsFilter, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0,
      expression: "expression",
      paramType: ParamTypes.HEADER,
      useType: undefined,
      useConverter: false,
      useValidation: false
    });
  });
});
