import {ParamTypes} from "@tsed/platform-params";
import {JsonParameterStore} from "@tsed/schema";

import {Next} from "./next.js";

describe("@Next", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Next() arg: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).toEqual(ParamTypes.NEXT_FN);
  });
});
