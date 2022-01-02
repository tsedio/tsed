import {expect} from "chai";
import {ParamTypes} from "@tsed/common";
import {Arg, Args} from "./args";
import {JsonParameterStore} from "@tsed/schema";

describe("@Args", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Args() args: any[]) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("PROTOCOL_ARGS");
    expect(param.paramType).to.eq(ParamTypes.$CTX);
  });
});

describe("@Arg", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Arg(0) args: any[]) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("PROTOCOL_ARGS.0");
    expect(param.paramType).to.eq(ParamTypes.$CTX);
  });
});
