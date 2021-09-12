import {ParamMetadata, ParamTypes} from "@tsed/platform-params";
import {Err} from "./error";
import {expect} from "chai";

describe("@Err", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@Err() arg: unknown) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.ERR);
  });
});
