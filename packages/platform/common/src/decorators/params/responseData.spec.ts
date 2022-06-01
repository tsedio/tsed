import {ParamTypes} from "@tsed/platform-params";
import {ResponseData} from "./responseData";
import {JsonParameterStore} from "@tsed/schema";

describe("@ResponseData", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@ResponseData() arg: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.$CTX);
    expect(param.dataPath).toEqual("$ctx.data");
  });
});
