import {ParamTypes} from "@tsed/platform-params";
import {JsonParameterStore} from "@tsed/schema";
import {expect} from "chai";
import {Next} from "./next";

describe("@Next", () => {
  it("should register a new parameter instance with the correct property", () => {
    class Ctrl {
      test(@Next() arg: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.paramType).to.eq(ParamTypes.NEXT_FN);
  });
});
