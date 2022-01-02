import {ParamTypes} from "@tsed/common";
import {expect} from "chai";
import {State} from "./state";
import {JsonParameterStore} from "@tsed/schema";

describe("@State", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Ctrl {
      test(@State("expression") test: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.LOCALS);
  });
});
