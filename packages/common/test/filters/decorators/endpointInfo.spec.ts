import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointInfo, ParamRegistry} from "../../../src/filters";
import {ENDPOINT_INFO} from "../../../src/filters/constants";

const sandbox = Sinon.createSandbox();
describe("@EndpointInfo", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "usePreHandler");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@EndpointInfo() arg: EndpointInfo) {
      }
    }

    ParamRegistry.usePreHandler.should.have.been.calledOnce.and.calledWithExactly(ENDPOINT_INFO, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
