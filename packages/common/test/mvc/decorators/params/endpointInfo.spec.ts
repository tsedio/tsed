import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ENDPOINT_INFO} from "../../../../src/filters/constants";
import {EndpointInfo, ParamRegistry} from "../../../../src/mvc";

const sandbox = Sinon.createSandbox();
describe("@EndpointInfo", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@EndpointInfo() arg: EndpointInfo) {
      }
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ENDPOINT_INFO, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
