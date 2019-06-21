import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ResponseData} from "../../../src/filters";
import {RESPONSE_DATA} from "../../../src/filters/constants";

const sandbox = Sinon.createSandbox();
describe("@ResponseData", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "usePreHandler");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@ResponseData() arg: any) {
      }
    }

    ParamRegistry.usePreHandler.should.have.been.calledOnce.and.calledWithExactly(RESPONSE_DATA, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
