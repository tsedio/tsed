import {ParamMetadata, ParamTypes, Req} from "@tsed/common";
import {prototypeOf} from "@tsed/core";
import {ParamRegistry} from "../../../src/mvc";

describe("ParamRegistry", () => {
  describe("getParams", () => {
    it("should returns params", () => {
      // GIVEN
      class Test {
        test(@Req() req: any) {}
      }

      // WHEN
      const result = ParamRegistry.getParams(prototypeOf(Test), "test");

      // THEN
      const param1 = new ParamMetadata({target: prototypeOf(Test), propertyKey: "test", index: 0});
      param1.paramType = ParamTypes.REQUEST;

      result.should.deep.eq([param1]);
    });
  });
});
