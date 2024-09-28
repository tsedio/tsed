import {JsonParameterStore} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {PathParams, RawPathParams} from "./pathParams.js";

describe("@PathParams", () => {
  it("should declare a path params", () => {
    class Test {}

    class Ctrl {
      test(@PathParams("expression", Test) header: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.PATH);
    expect(param.type).toEqual(Test);
    expect(param.pipes).toHaveLength(2);
  });
  it("should declara a path params with options", () => {
    class Test {}

    class Ctrl {
      test(@PathParams({expression: "expression", useType: Test, useValidation: false}) param: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.PATH);
    expect(param.type).toEqual(Test);
    expect(param.pipes).toHaveLength(1);
  });
});

describe("@RawPathParams", () => {
  it("should declare a raw path params", () => {
    class Ctrl {
      test(@RawPathParams("expression") header: string) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.PATH);
    expect(param.type).toEqual(String);
    expect(param.pipes).toHaveLength(0);
  });
  it("should declare a raw path params with options", () => {
    class Ctrl {
      test(@RawPathParams({expression: "expression", useValidation: true, useType: String}) param: Date) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.PATH);
    expect(param.type).toEqual(String);
    expect(param.pipes).toHaveLength(1);
  });
});
