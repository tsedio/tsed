import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {EndpointInfo, Next, ParamRegistry} from "../../../../src/mvc";
import {EXPRESS_NEXT_FN} from "../../../../src/filters/constants";

const sandbox = Sinon.createSandbox();
describe("@Next", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "usePreHandler");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Next() arg: EndpointInfo) {
      }
    }

    ParamRegistry.usePreHandler.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_NEXT_FN, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
