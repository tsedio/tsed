import {Session} from "./session";
import {expect} from "chai";
import {ParamTypes} from "../domain/ParamTypes";
import {JsonParameterStore} from "@tsed/schema";

describe("@Session", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@Session({expression: "expression", useType: Test}) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).to.eq("expression");
    expect(param.paramType).to.eq(ParamTypes.SESSION);
    expect(param.type).to.eq(Test);
  });
});
