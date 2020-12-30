import {Controller, QueryParams, Req} from "@tsed/common";
import {prototypeOf, Store} from "@tsed/core";
import {JsonEntityStore} from "@tsed/schema";
import {expect} from "chai";
import {Get} from "../decorators/method/route";
import {ParamMetadata} from "./ParamMetadata";
import {ParamTypes} from "./ParamTypes";

class Test {
  method(arg1: any, arg2: any) {}
}

describe("ParamMetadata", () => {
  describe("props", () => {
    it("should return the required value", () => {
      const paramMetadata = ParamMetadata.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;

      expect(paramMetadata.required).to.be.a("boolean").and.to.eq(true);

      expect(paramMetadata.expression).to.be.a("string").and.to.eq("test");

      expect(paramMetadata.collectionType).to.eq(undefined);
      expect(paramMetadata.type).to.eq(Test);
      expect(paramMetadata.index).to.eq(0);
      expect(paramMetadata.store).to.be.an.instanceof(Store);
    });
  });

  describe("as a service", () => {
    it("should return the service", () => {
      const paramMetadata = ParamMetadata.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.paramType = ParamTypes.ERR;

      expect(paramMetadata.paramType).to.be.a("string").to.eq(ParamTypes.ERR);
    });
  });

  describe("getParams", () => {
    it("should returns params (REQ)", () => {
      // GIVEN
      @Controller("/")
      class Test {
        @Get("/")
        test(@Req() req: any) {}
      }

      // WHEN
      const result = ParamMetadata.getParams(prototypeOf(Test), "test");

      // THEN
      expect(result[0].paramType).to.deep.eq(ParamTypes.REQUEST);
    });

    it("should returns params (RES)", () => {
      // GIVEN
      class Test {
        @Get("/")
        test(@Req() req: any) {}
      }

      // WHEN
      const result = ParamMetadata.getParams(prototypeOf(Test), "test");

      // THEN

      expect(result[0].paramType).to.deep.eq(ParamTypes.REQUEST);
    });
    it("should returns params from inherited", () => {
      // GIVEN
      class BaseTest {
        list(@QueryParams("search") search: string) {}

        base(@QueryParams("base") test: string) {}
      }

      class Test extends BaseTest {
        test(@Req() req: any) {}

        base(@QueryParams("test") test: string) {}
      }

      // WHEN
      const result1 = ParamMetadata.getParams(Test, "list");
      const result2 = ParamMetadata.getParams(Test, "test");
      const result3 = ParamMetadata.getParams(Test, "unknown");
      const result4 = ParamMetadata.getParams(Test, "base");

      // THEN
      expect(result1.length).to.deep.eq(1);
      expect(result2.length).to.deep.eq(1);
      expect(result3).to.deep.eq([]);
      expect(result4.length).to.deep.eq(1);
      expect(result4[0].token).to.eq(Test);
    });
  });
});
