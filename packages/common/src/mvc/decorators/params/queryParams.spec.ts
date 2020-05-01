import {ParamRegistry, ParamTypes, QueryParams, RawQueryParams} from "../../../../src/mvc";

describe("@QueryParams", () => {
  it("should call ParamFilter.useParam method with the correct parameters", () => {
    class Test {}

    class Ctrl {
      test(@QueryParams("expression", Test) header: Test) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.QUERY);
    param.type.should.eq(Test);
  });

  it("should call ParamFilter.useParam method with the correct parameters (rawQueryParams)", () => {
    class Ctrl {
      test(@RawQueryParams("expression") header: string) {}
    }

    const param = ParamRegistry.get(Ctrl, "test", 0);
    param.expression.should.eq("expression");
    param.paramType.should.eq(ParamTypes.QUERY);
  });
});
