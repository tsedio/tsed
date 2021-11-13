import {prototypeOf} from "@tsed/core";
import {Get, In, JsonClassStore, JsonMethodStore, JsonParameterTypes, Path} from "@tsed/schema";
import {getJsonEntityStore} from "../utils/getJsonEntityStore";
import {JsonParameterStore} from "./JsonParameterStore";
import {expect} from "chai";

describe("JsonParameterStore", () => {
  describe("new JsonParameterStore", () => {
    it("should load entities", () => {
      class TestDynamicUrlCtrl {
        async get(id: string) {}
      }

      const entity = getJsonEntityStore(prototypeOf(TestDynamicUrlCtrl), "get", 0);

      expect(entity).to.be.instanceof(JsonParameterStore);
      expect(entity.parent).to.be.instanceof(JsonMethodStore);
      expect(entity.parent.parent).to.be.instanceof(JsonClassStore);
      expect(entity.parent.parent.parent).to.be.instanceof(JsonClassStore);
      expect(entity.nestedGenerics).to.deep.eq([]);
      expect(entity.required).to.eq(false);
      expect(entity.isRequired("")).to.eq(false);
      expect(entity.allowedRequiredValues).to.deep.eq([]);
    });
  });
  describe("getParams()", () => {
    it("should returns params (body + path)", () => {
      // GIVEN
      @Path("/")
      class Test {
        @Get("/")
        test(@In("body") body: any) {}
      }

      // WHEN
      const result = JsonParameterStore.getParams(prototypeOf(Test), "test");

      // THEN
      expect(result[0].parameter.get("in")).to.deep.eq("body");
    });
    it("should returns params (body)", () => {
      // GIVEN
      class Test {
        @Get("/")
        test(@In(JsonParameterTypes.BODY) body: any) {}
      }

      // WHEN
      const result = JsonParameterStore.getParams(prototypeOf(Test), "test");
      // THEN

      expect(result[0].parameter.get("in")).to.deep.eq("body");
    });
    it("should returns params from inherited", () => {
      // GIVEN
      class BaseTest {
        @Get("/")
        list(@(In("query").Name("search")) search: string) {}

        @Get("/")
        base(@(In("query").Name("base")) test: string) {}
      }

      class Test extends BaseTest {
        @Get("/")
        test(@(In("query").Name("search")) search: string) {}

        @Get("/")
        base(@(In("query").Name("test")) search: string) {}
      }

      // WHEN
      const result1 = JsonParameterStore.getParams(prototypeOf(Test), "list");
      const result2 = JsonParameterStore.getParams(prototypeOf(Test), "test");
      const result3 = JsonParameterStore.getParams(prototypeOf(Test), "unknown");
      const result4 = JsonParameterStore.getParams(prototypeOf(Test), "base");

      // THEN
      expect(result1.length).to.deep.eq(1);
      expect(result2.length).to.deep.eq(1);
      expect(result3).to.deep.eq([]);
      expect(result4.length).to.deep.eq(1);
      expect(result4[0].token).to.eq(Test);
    });
  });
});
