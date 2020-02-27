import {ParamRegistry, ParamTypes} from "@tsed/common/src";
import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {Arg, Args} from "./args";

const sandbox = Sinon.createSandbox();
describe("@Args", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Args() args: any[]) {}
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.REQUEST, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      expression: "args",
      index: 0,
      useConverter: false,
      useValidation: false,
      useType: undefined
    });
  });
});

describe("@Arg", () => {
  before(() => {
    sandbox.stub(ParamRegistry, "useFilter");
  });
  after(() => {
    sandbox.restore();
  });

  it("should call ParamFilter.usePrehandler method with the correct parameters", () => {
    class Ctrl {
      test(@Arg(0) args: any[]) {}
    }

    ParamRegistry.useFilter.should.have.been.calledOnce.and.calledWithExactly(ParamTypes.REQUEST, {
      target: prototypeOf(Ctrl),
      propertyKey: "test",
      expression: "args.0",
      index: 0,
      useConverter: false,
      useValidation: false,
      useType: undefined
    });
  });
});
