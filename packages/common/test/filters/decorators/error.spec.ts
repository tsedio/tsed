import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointInfo, Err, ParamRegistry} from "../../../src/filters";
import {EXPRESS_ERR} from "../../../src/filters/constants";

const sandbox = Sinon.createSandbox();
describe("@Err", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "usePreHandler");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Err() arg: EndpointInfo) {
      }
    }

    ParamRegistry.usePreHandler.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_ERR, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
