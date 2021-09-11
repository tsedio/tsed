import {ParamMetadata, ParamTypes} from "@tsed/platform-params";
import {expect} from "chai";
import {ResponseData} from "./responseData";

describe("@ResponseData", () => {
  it("should register a new ParamMetadata instance with the correct property", () => {
    class Ctrl {
      test(@ResponseData() arg: any) {}
    }

    const param = ParamMetadata.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.$CTX);
    expect(param.dataPath).to.eq("$ctx.data");
  });
});
