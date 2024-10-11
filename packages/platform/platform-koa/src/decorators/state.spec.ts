import {ParamTypes} from "@tsed/platform-params";
import {JsonParameterStore} from "@tsed/schema";

import {State} from "./state.js";

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
