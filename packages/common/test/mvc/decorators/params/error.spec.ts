import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {EXPRESS_ERR} from "../../../../src/filters/constants";
import {EndpointInfo, Err, ParamRegistry} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@Err", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Err() arg: EndpointInfo) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_ERR, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
