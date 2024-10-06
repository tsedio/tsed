import {JsonParameterStore} from "@tsed/schema";

import {ParamTypes} from "../domain/ParamTypes.js";
import {QueryParams, RawQueryParams} from "./queryParams.js";

describe("@QueryParams", () => {
  it("should declare query params", () => {
    class Test {}

    class Ctrl {
      test(@QueryParams("expression", Test) header: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.QUERY);
    expect(param.type).toEqual(Test);
    expect(param.pipes).toHaveLength(2);
  });
  it("should declare query params with options", () => {
    class Test {}

    class Ctrl {
      test(@QueryParams({expression: "expression", useType: Test, useValidation: false}) param: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.QUERY);
    expect(param.type).toEqual(Test);
    expect(param.pipes).toHaveLength(1);
  });
});

describe("@RawQueryParams", () => {
  it("should declare raw query params", () => {
    class Ctrl {
      test(@RawQueryParams("expression") header: string) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.QUERY);
    expect(param.type).toEqual(String);
    expect(param.pipes).toHaveLength(0);
  });
  it("should declare raw query params with options", () => {
    class Ctrl {
      test(@RawQueryParams({expression: "expression", useValidation: true, useType: String}) param: Date) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.QUERY);
    expect(param.type).toEqual(String);
    expect(param.pipes).toHaveLength(1);
  });
});
