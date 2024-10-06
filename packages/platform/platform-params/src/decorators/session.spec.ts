import {JsonParameterStore} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {Session} from "./session.js";

describe("@Session", () => {
  it("should declare a session params", () => {
    class Test {}

    class Ctrl {
      test(@Session() body: any) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual(undefined);
    expect(param.paramType).toEqual(ParamTypes.SESSION);
    expect(param.type).toEqual(Object);
    expect(param.pipes).toHaveLength(0);
  });
  it("should declare a session params with options", () => {
    class Test {}

    class Ctrl {
      test(@Session({expression: "expression", useType: Test}) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.SESSION);
    expect(param.type).toEqual(Test);
    expect(param.pipes).toHaveLength(0);
  });

  it("should declare a session params with options (validation + mapping)", () => {
    class Test {}

    class Ctrl {
      test(@Session({expression: "expression", useType: Test, useValidation: true, useMapper: true}) body: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.SESSION);
    expect(param.type).toEqual(Test);
    expect(param.pipes).toHaveLength(2);
  });
});
