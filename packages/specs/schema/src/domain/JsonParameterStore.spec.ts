import {DecoratorParameters, Metadata, prototypeOf, StoreMerge, useDecorators, useMethodDecorators} from "@tsed/core";
import {Consumes, Get, In, JsonClassStore, JsonMethodStore, JsonParameterTypes, Path, Returns} from "@tsed/schema";
import {getJsonEntityStore} from "../utils/getJsonEntityStore";
import {JsonParameterStore} from "./JsonParameterStore";
import {ParamTypes, UseParam} from "@tsed/common";

describe("JsonParameterStore", () => {
  describe("new JsonParameterStore", () => {
    it("should load entities", () => {
      class TestDynamicUrlCtrl {
        async get(id: string) {}
      }

      const entity = getJsonEntityStore(prototypeOf(TestDynamicUrlCtrl), "get", 0);

      expect(entity).toBeInstanceOf(JsonParameterStore);
      expect(entity.parent).toBeInstanceOf(JsonMethodStore);
      expect(entity.parent.parent).toBeInstanceOf(JsonClassStore);
      expect(entity.parent.parent.parent).toBeInstanceOf(JsonClassStore);
      expect(entity.nestedGenerics).toEqual([]);
      expect(entity.required).toBe(false);
      expect(entity.isRequired("")).toBe(false);
      expect(entity.allowedRequiredValues).toEqual([]);
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
      expect(result[0].parameter.get("in")).toEqual("body");
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

      expect(result[0].parameter.get("in")).toEqual("body");
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
      expect(result1.length).toEqual(1);
      expect(result2.length).toEqual(1);
      expect(result3).toEqual([]);
      expect(result4.length).toEqual(1);
      expect(result4[0].token).toBe(Test);
    });
  });
});
