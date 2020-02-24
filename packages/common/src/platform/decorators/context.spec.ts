import {ParamRegistry, ParamTypes} from "@tsed/common";
import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {Context} from "./context";

const sandbox = Sinon.createSandbox();
describe("@Context ", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });
  it("should call ParamFilter.useFilter method with the correct parameters", () => {
    class Ctrl {
      test(@Context("expression") test: any) {}
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.CONTEXT, {
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
