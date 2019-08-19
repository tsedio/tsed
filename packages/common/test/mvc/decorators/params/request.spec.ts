import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, Req} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@Req", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Req() arg: Req) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.REQUEST, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      expression: undefined,
      index: 0,
      useConverter: false,
      useValidation: false,
      useType: undefined
    });
  });
});
