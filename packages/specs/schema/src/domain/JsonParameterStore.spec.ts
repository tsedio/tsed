import {prototypeOf, Store} from "@tsed/core";

import {Allow} from "../decorators/common/allow.js";
import {Required} from "../decorators/common/required.js";
import {In} from "../decorators/operations/in.js";
import {Path} from "../decorators/operations/path.js";
import {Get} from "../decorators/operations/route.js";
import {getJsonEntityStore} from "../utils/getJsonEntityStore.js";
import {JsonClassStore} from "./JsonClassStore.js";
import {JsonMethodStore} from "./JsonMethodStore.js";
import {JsonParameterStore} from "./JsonParameterStore.js";
import {JsonParameterTypes} from "./JsonParameterTypes.js";

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
  describe("isRequired", () => {
    describe("when property is required", () => {
      it("should return the expected required state", () => {
        class Test {
          @Get("/")
          test(@Required() @In(JsonParameterTypes.BODY) body: any) {}
        }

        const store = JsonParameterStore.get(Test, "test", 0);

        expect(store.isRequired(0)).toEqual(false);
        expect(store.isRequired("")).toEqual(true);
        expect(store.isRequired(null)).toEqual(true);
        expect(store.isRequired(undefined)).toEqual(true);
      });
    });

    describe("when property is required and have allowed values", () => {
      it("should validate the required values", () => {
        class Test {
          @Get("/")
          test(@Required() @Allow(null) @In(JsonParameterTypes.BODY) body: any) {}
        }

        const store = JsonParameterStore.get(Test, "test", 0);

        expect(store.allowedRequiredValues).toEqual([null]);
        expect(store.isRequired(0)).toEqual(false);
        expect(store.isRequired("")).toEqual(true);
        expect(store.isRequired(null)).toEqual(false);
        expect(store.isRequired(undefined)).toEqual(true);
      });

      it("should validate the required values (2)", () => {
        class Test {
          @Get("/")
          test(@Required() @Allow("") @In(JsonParameterTypes.BODY) body: any) {}
        }

        const store = JsonParameterStore.get(Test, "test", 0);
        store.required = true;

        expect(store.allowedRequiredValues).toEqual([""]);
        expect(store.isRequired(0)).toEqual(false);
        expect(store.isRequired("")).toEqual(false);
        expect(store.isRequired(null)).toEqual(true);
        expect(store.isRequired(undefined)).toEqual(true);
      });

      it("should validate the required values (3)", () => {
        class Test {
          @Get("/")
          test(@Required() @Allow("") @In(JsonParameterTypes.BODY) body: any) {}
        }

        const store = JsonParameterStore.get(Test, "test", 0);
        store.required = true;

        expect(store.allowedRequiredValues).toEqual([""]);
        expect(store.isRequired(0)).toEqual(false);
        expect(store.isRequired("")).toEqual(false);
        expect(store.isRequired(null)).toEqual(true);
        expect(store.isRequired(undefined)).toEqual(true);
      });
    });

    describe("when property is not required", () => {
      it("should validate values", () => {
        class Test {
          @Get("/")
          test(@Required(false) @Allow("") @In(JsonParameterTypes.BODY) body: any) {}
        }

        const store = JsonParameterStore.get(Test, "test", 0);
        store.required = false;

        expect(store.isRequired(0)).toEqual(false);
        expect(store.isRequired("")).toEqual(false);
        expect(store.isRequired(null)).toEqual(false);
        expect(store.isRequired(undefined)).toEqual(false);
      });
    });
  });
  describe("props", () => {
    it("should return the required value", () => {
      class Test {
        method(arg1: any, arg2: any) {}
      }

      const paramMetadata = JsonParameterStore.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;

      expect(paramMetadata.required).toEqual(true);

      expect(paramMetadata.expression).toEqual("test");

      expect(paramMetadata.collectionType).toEqual(undefined);
      expect(paramMetadata.type).toEqual(Test);
      expect(paramMetadata.index).toEqual(0);
      expect(paramMetadata.store).toBeInstanceOf(Store);
    });
  });
  describe("as a service", () => {
    it("should return the service", () => {
      class Test {
        method(arg1: any, arg2: any) {}
      }

      const paramMetadata = JsonParameterStore.get(Test, "method", 0);
      paramMetadata.required = true;
      paramMetadata.expression = "test";
      paramMetadata.type = Test;
      paramMetadata.paramType = "ERR";

      expect(paramMetadata.paramType).toEqual("ERR");
    });
  });
});
