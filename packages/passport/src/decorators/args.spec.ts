import {ParamRegistry, ParamTypes} from "@tsed/common/src";
import {Arg, Args} from "./args";

describe("@Args", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Args() args: any[]) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("args");
    param.paramType.should.eq(ParamTypes.REQUEST);
  });
});

describe("@Arg", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Arg(0) args: any[]) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("args.0");
    param.paramType.should.eq(ParamTypes.REQUEST);
  });
});
