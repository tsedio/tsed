import {ParamTypes} from "../domain/ParamTypes";
import {QueryParams, RawQueryParams} from "./queryParams";
import {JsonParameterStore} from "@tsed/schema";

describe("@QueryParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@QueryParams("expression", Test) header: Test) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.QUERY);
    expect(param.type).toEqual(Test);
  });

  it("should call ParamFilter.useParam method with the correct parameters (rawQueryParams)", () => {
    class Ctrl {
      test(@RawQueryParams("expression") header: string) {}
    }

    const param = JsonParameterStore.get(Ctrl, "test", 0);
    expect(param.expression).toEqual("expression");
    expect(param.paramType).toEqual(ParamTypes.QUERY);
  });
});
