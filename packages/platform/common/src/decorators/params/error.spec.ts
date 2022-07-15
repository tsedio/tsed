import {ParamTypes} from "@tsed/platform-params";
import {Err} from "./error";
import {JsonParameterStore} from "@tsed/schema";

describe("@Err", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Err() arg: unknown) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.ERR);
  });
});
