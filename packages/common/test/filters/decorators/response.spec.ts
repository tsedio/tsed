import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, Res} from "../../../src/filters";
import {EXPRESS_RESPONSE} from "../../../src/filters/constants";

const sandbox = Sinon.createSandbox();
describe("@Res", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "usePreHandler");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Res() arg: Res) {
      }
    }

    ParamRegistry.usePreHandler.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_RESPONSE, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
