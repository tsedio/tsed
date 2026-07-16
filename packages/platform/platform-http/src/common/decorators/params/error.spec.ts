import {Err} from "./error.js";
import {JsonParameterStore} from "@tsed/schema";
import {ParamTypes} from "@tsed/platform-params";

describe("@Err", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Err() arg: unknown) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.ERR);
  });
});
