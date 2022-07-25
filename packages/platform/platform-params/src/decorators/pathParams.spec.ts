import {ParamTypes} from "../domain/ParamTypes";
import {PathParams, RawPathParams} from "./pathParams";
import {JsonParameterStore} from "@tsed/schema";

describe("@PathParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@PathParams("expression", Test) header: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.PATH);
    expect(param.type).toEqual(Test);
  });
  it("should call ParamFilter.useParam method with the correct parameters (raw)", () => {
    class Ctrl {
      test(@RawPathParams("expression") header: string) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.PATH);
  });
});
