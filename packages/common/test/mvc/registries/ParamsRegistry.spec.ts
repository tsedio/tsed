import {prototypeOf} from "@tsed/core";
import {ParamMetadata, ParamRegistry, Req} from "../../../src/mvc";
import {EXPRESS_REQUEST} from "../../../src/filters/constants";


describe("ParamRegistry", () => {
  describe("getParams", () => {
    it("should returns params", () => {
      // GIVEN
      class Test {
        test(@Req() req: any) {
        }
      }

      // WHEN
      const result = ParamRegistry.getParams(prototypeOf(Test), "test");

      // THEN
      const param1 = new ParamMetadata(prototypeOf(Test), "test", 0);
      param1.service = EXPRESS_REQUEST;
      param1.useConverter = false;

      result.should.deep.eq([param1]);
    });
  });
});
