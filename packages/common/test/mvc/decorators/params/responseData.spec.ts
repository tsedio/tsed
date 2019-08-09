import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {RESPONSE_DATA} from "../../../../src/filters/constants";
import {ParamRegistry, ResponseData} from "../../../../src/mvc";

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

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(RESPONSE_DATA, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
