import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointInfo, Next, ParamRegistry, ParamTypes} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@Next", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Next() arg: EndpointInfo) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.NEXT_FN, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      index: 0,
      useConverter: false,
      useValidation: false
    });
  });
});
