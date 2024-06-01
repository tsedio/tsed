import {ParamTypes} from "@tsed/common";
import {State} from "./state.js";
import {JsonParameterStore} from "@tsed/schema";

describe("@State", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@State("expression") test: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.LOCALS);
  });
});
