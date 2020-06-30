import {expect} from "chai";
import {ParamMetadata, ParamTypes} from "@tsed/common/src";
import {Arg, Args} from "./args";

describe("@Args", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Args() args: any[]) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("args");
    expect(param.paramType).to.eq(ParamTypes.REQUEST);
  });
});

describe("@Arg", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Arg(0) args: any[]) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("args.0");
    expect(param.paramType).to.eq(ParamTypes.REQUEST);
  });
});
