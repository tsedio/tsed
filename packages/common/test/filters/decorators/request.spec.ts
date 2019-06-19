import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, Req} from "../../../src/filters";
import {EXPRESS_REQUEST} from "../../../src/filters/constants";

const sandbox = Sinon.createSandbox();
describe("@Req", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "usePreHandler");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Req() arg: Req) {
      }
    }

    ParamRegistry.usePreHandler.should.have.been.calledOnce.and.calledWithExactly(EXPRESS_REQUEST, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      parameterIndex: 0
    });
  });
});
