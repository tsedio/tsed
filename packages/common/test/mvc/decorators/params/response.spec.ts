import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {EXPRESS_RESPONSE} from "../../../../src/filters/constants";
import {ParamRegistry, Res} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@Res", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Res() arg: Res) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_RESPONSE, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
