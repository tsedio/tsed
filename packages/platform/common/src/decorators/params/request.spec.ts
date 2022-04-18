import {ParamTypes, PlatformRequest, Request} from "@tsed/common";
import {expect} from "chai";
import {IncomingMessage} from "http";
import {Req} from "./request";
import {JsonParameterStore} from "@tsed/schema";

describe("@Req", () => {
  it("should register a new parameter instance with the correct property (RawRequest)", () => {
    class Ctrl {
      test(@Request() arg: Req) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.REQUEST);
    expect(param.type).to.eq(Req);
  });

  it("should register a new parameter instance with the correct property (RawRequest with expression)", () => {
    class Ctrl {
      test(@Req("user") arg: Req) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.REQUEST);
    expect(param.expression).to.eq("user");
    expect(param.type).to.eq(Req);
  });

  it("should register a new parameter instance with the correct property (PlatformRequest)", () => {
    class Ctrl {
      test(@Req() arg: PlatformRequest) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.PLATFORM_REQUEST);
    expect(param.type).to.eq(PlatformRequest);
  });

  it("should register a new parameter instance with the correct property (IncomingMessage)", () => {
    class Ctrl {
      test(@Req() arg: IncomingMessage) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.NODE_REQUEST);
    expect(param.type).to.eq(IncomingMessage);
  });
});
