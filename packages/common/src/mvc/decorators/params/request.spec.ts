import {prototypeOf} from "@tsed/core";
import * as Sinon from "sinon";
import {ParamRegistry, ParamTypes, Req} from "../../../../src/mvc";

describe("@Req", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Req() arg: Req) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.paramType.should.eq(ParamTypes.REQUEST);
  });
});
