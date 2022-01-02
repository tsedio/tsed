import {PlatformResponse} from "@tsed/common";
import {ParamTypes} from "@tsed/platform-params";
import {expect} from "chai";
import {ServerResponse} from "http";
import {Response} from "./response";
import {JsonParameterStore} from "@tsed/schema";

describe("@Res", () => {
  it("should register a new parameter instance with the correct property (RawRes)", () => {
    class Ctrl {
      test(@Response() arg: Response) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.RESPONSE);
    expect(param.type).to.eq(Response);
  });
  it("should register a new parameter instance with the correct property (PlatformResponse)", () => {
    class Ctrl {
      test(@Response() arg: PlatformResponse) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.PLATFORM_RESPONSE);
    expect(param.type).to.eq(PlatformResponse);
  });
  it("should register a new parameter instance with the correct property (ServerResponse)", () => {
    class Ctrl {
      test(@Response() arg: ServerResponse) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.NODE_RESPONSE);
    expect(param.type).to.eq(ServerResponse);
  });
});
