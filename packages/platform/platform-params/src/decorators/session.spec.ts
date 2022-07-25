import {Session} from "./session";
import {ParamTypes} from "../domain/ParamTypes";
import {JsonParameterStore} from "@tsed/schema";

describe("@Session", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@Session({expression: "expression", useType: Test}) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.SESSION);
    expect(param.type).toEqual(Test);
  });
});
