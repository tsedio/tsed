import {expect} from "chai";
import {ParamTypes} from "../domain/ParamTypes";
import {Cookies} from "./cookies";
import {JsonParameterStore} from "@tsed/schema";

describe("@Cookies", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@Cookies("expression", Test) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.COOKIES);
    expect(param.type).to.eq(Test);
  });
});
