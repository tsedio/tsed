import {ParamTypes} from "@tsed/platform-params";
import {expect} from "chai";
import {ResponseData} from "./responseData";
import {JsonParameterStore} from "@tsed/schema";

describe("@ResponseData", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@ResponseData() arg: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.$CTX);
    expect(param.dataPath).to.eq("$ctx.data");
  });
});
