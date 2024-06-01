import {ParamTypes} from "@tsed/common";
import {Arg, Args} from "./args.js";
import {JsonParameterStore} from "@tsed/schema";

describe("@Args", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Args() args: any[]) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toBe("PROTOCOL_ARGS");
    expect(param.paramType).toBe(ParamTypes.$CTX);
  });
});

describe("@Arg", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Arg(0) args: any[]) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toBe("PROTOCOL_ARGS.0");
    expect(param.paramType).toBe(ParamTypes.$CTX);
  });
});
