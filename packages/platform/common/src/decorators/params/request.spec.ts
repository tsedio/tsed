import {ParamTypes} from "@tsed/platform-params";
import {JsonParameterStore} from "@tsed/schema";
import {IncomingMessage} from "http";

import {PlatformRequest} from "../../services/PlatformRequest.js";
import {Req, Request} from "./request.js";

describe("@Req", () => {
  it("should register a new parameter instance with the correct property (RawRequest)", () => {
    class Ctrl {
      test(@Request() arg: Req) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.REQUEST);
    expect(param.type).toEqual(Req);
  });

  it("should register a new parameter instance with the correct property (RawRequest with expression)", () => {
    class Ctrl {
      test(@Req("user") arg: Req) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.REQUEST);
    expect(param.expression).toEqual("user");
    expect(param.type).toEqual(Req);
  });

  it("should register a new parameter instance with the correct property (PlatformRequest)", () => {
    class Ctrl {
      test(@Req() arg: PlatformRequest) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.PLATFORM_REQUEST);
    expect(param.type).toEqual(PlatformRequest);
  });

  it("should register a new parameter instance with the correct property (IncomingMessage)", () => {
    class Ctrl {
      test(@Req() arg: IncomingMessage) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.NODE_REQUEST);
    expect(param.type).toEqual(IncomingMessage);
  });
});
