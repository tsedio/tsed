import {PlatformRequest} from "@tsed/common";
import {expect} from "chai";
import {IncomingMessage} from "http";
import {ParamMetadata, ParamTypes, Req} from "../../../../src/mvc";

describe("@Req", () => {
  it("should register a new ParamMetadata instance with the correct property (RawRequest)", () => {
    class Ctrl {
      test(@Req() arg: Req) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.REQUEST);
    expect(param.type).to.eq(Req);
  });

  it("should register a new ParamMetadata instance with the correct property (PlatformRequest)", () => {
    class Ctrl {
      test(@Req() arg: PlatformRequest) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.PLATFORM_REQUEST);
    expect(param.type).to.eq(PlatformRequest);
  });

  it("should register a new ParamMetadata instance with the correct property (IncomingMessage)", () => {
    class Ctrl {
      test(@Req() arg: IncomingMessage) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.NODE_REQUEST);
    expect(param.type).to.eq(IncomingMessage);
  });
});
