import {ParamTypes} from "../domain/ParamTypes.js";
import {Cookies} from "./cookies.js";
import {JsonParameterStore} from "@tsed/schema";

describe("@Cookies", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@Cookies("expression", Test) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.COOKIES);
    expect(param.type).toEqual(Test);
  });
});
