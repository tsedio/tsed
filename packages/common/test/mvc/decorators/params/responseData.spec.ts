import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, ResponseData} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@ResponseData", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@ResponseData() arg: any) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.RESPONSE_DATA, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      index: 0
    });
  });
});
