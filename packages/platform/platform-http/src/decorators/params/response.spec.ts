import {ParamTypes} from "@tsed/platform-params";
import {JsonParameterStore} from "@tsed/schema";
import {ServerResponse} from "http";

import {PlatformResponse} from "../../services/PlatformResponse.js";
import {Res, Response} from "./response.js";

describe("@Res", () => {
  it("should register a new parameter instance with the correct property (RawRes)", () => {
    class Ctrl {
      test(@Response() arg: Response) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.RESPONSE);
    expect(param.type).toEqual(Response);
  });
  it("should register a new parameter instance with the correct property (PlatformResponse)", () => {
    class Ctrl {
      test(@Response() arg: PlatformResponse) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.PLATFORM_RESPONSE);
    expect(param.type).toEqual(PlatformResponse);
  });
  it("should register a new parameter instance with the correct property (ServerResponse)", () => {
    class Ctrl {
      test(@Response() arg: ServerResponse) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.NODE_RESPONSE);
    expect(param.type).toEqual(ServerResponse);
  });
});
