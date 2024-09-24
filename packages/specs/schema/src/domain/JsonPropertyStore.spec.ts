import {prototypeOf} from "@tsed/core";

import {Allow, JsonClassStore, JsonPropertyStore, Required} from "../index.js";
import {getJsonEntityStore} from "../utils/getJsonEntityStore.js";

describe("JsonParameterStore", () => {
  it("should create entity with required value", () => {
    class TestDynamicUrlCtrl {
      @Required()
      prop: string;
    }

    const entity = getJsonEntityStore(prototypeOf(TestDynamicUrlCtrl), "prop");

    expect(entity).toBeInstanceOf(JsonPropertyStore);
    expect(entity.parent).toBeInstanceOf(JsonClassStore);
    expect(entity.parent.parent.parent).toBeInstanceOf(JsonClassStore);
    expect(entity.nestedGenerics).toEqual([]);
    expect(entity.required).toBe(true);
    expect(entity.isRequired("")).toBe(true);
    expect(entity.allowedRequiredValues).toEqual([]);
    expect(entity.isDiscriminatorKey()).toEqual(false);

    entity.required = false;
    expect(entity.required).toBe(false);

    entity.required = true;
    expect(entity.required).toBe(true);
  });
  it("should create entity with allowed value", () => {
    class TestDynamicUrlCtrl {
      @Required(true, "")
      prop: string;
    }

    const entity = getJsonEntityStore(prototypeOf(TestDynamicUrlCtrl), "prop");

    expect(entity).toBeInstanceOf(JsonPropertyStore);
    expect(entity.parent).toBeInstanceOf(JsonClassStore);
    expect(entity.parent.parent.parent).toBeInstanceOf(JsonClassStore);
    expect(entity.nestedGenerics).toEqual([]);
    expect(entity.required).toBe(true);
    expect(entity.isRequired("")).toBe(false);
    expect(entity.allowedRequiredValues).toEqual([""]);

    entity.required = false;
    expect(entity.required).toBe(false);

    entity.required = true;
    expect(entity.required).toBe(true);
  });
  describe("required() and allowRequiredValues", () => {
    it("should return the required value", () => {
      class Test {
        @Required(true)
        @Allow(null, "")
        test: string;
      }

      const jsonPropertyStore = JsonPropertyStore.get(Test, "test");
      jsonPropertyStore.required = true;
      jsonPropertyStore.type = Test;

      expect(jsonPropertyStore.required).toEqual(true);

      expect(jsonPropertyStore.collectionType).toEqual(undefined);
      expect(jsonPropertyStore.type).toEqual(Test);
      expect(jsonPropertyStore.isCollection).toEqual(false);
    });
  });

  describe("isRequired", () => {
    describe("when property is required", () => {
      class Test {
        @Required(true)
        test: string;
      }

      let jsonPropertyStore: JsonPropertyStore;

      beforeAll(() => {
        jsonPropertyStore = JsonPropertyStore.get(Test, "test");
        jsonPropertyStore.required = true;
      });
      it("should return false (value 0)", () => {
        expect(jsonPropertyStore.isRequired(0)).toEqual(false);
      });

      it("should return true (value '')", () => {
        expect(jsonPropertyStore.isRequired("")).toEqual(true);
      });
      it("should return true (value null)", () => {
        expect(jsonPropertyStore.isRequired(null)).toEqual(true);
      });
      it("should return true (value undefined)", () => {
        expect(jsonPropertyStore.isRequired(undefined)).toEqual(true);
      });
    });

    describe("when property is required and have allowed values", () => {
      it("should validate the required values", () => {
        class Test {
          @Required()
          @Allow(null)
          test: string;
        }

        let jsonPropertyStore: JsonPropertyStore;
        jsonPropertyStore = JsonPropertyStore.get(Test, "test");

        expect(jsonPropertyStore.allowedRequiredValues).toEqual([null]);
        expect(jsonPropertyStore.isRequired(0)).toEqual(false);
        expect(jsonPropertyStore.isRequired("")).toEqual(true);
        expect(jsonPropertyStore.isRequired(null)).toEqual(false);
        expect(jsonPropertyStore.isRequired(undefined)).toEqual(true);
      });

      it("should validate the required values (2)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let jsonPropertyStore: JsonPropertyStore;
        jsonPropertyStore = JsonPropertyStore.get(Test, "test");

        expect(jsonPropertyStore.allowedRequiredValues).toEqual([""]);
        expect(jsonPropertyStore.isRequired(0)).toEqual(false);
        expect(jsonPropertyStore.isRequired("")).toEqual(false);
        expect(jsonPropertyStore.isRequired(null)).toEqual(true);
        expect(jsonPropertyStore.isRequired(undefined)).toEqual(true);
      });

      it("should validate the required values (3)", () => {
        class Test {
          @Allow("")
          test: string;
        }

        let jsonPropertyStore: JsonPropertyStore;
        jsonPropertyStore = JsonPropertyStore.get(Test, "test");

        expect(jsonPropertyStore.allowedRequiredValues).toEqual([""]);
        expect(jsonPropertyStore.isRequired(0)).toEqual(false);
        expect(jsonPropertyStore.isRequired("")).toEqual(false);
        expect(jsonPropertyStore.isRequired(null)).toEqual(true);
        expect(jsonPropertyStore.isRequired(undefined)).toEqual(true);
      });
    });

    describe("when property is not required", () => {
      it("should validate values", () => {
        class Test {
          @Required(false)
          test: string;
        }

        const jsonPropertyStore = JsonPropertyStore.get(Test, "test");
        jsonPropertyStore.required = false;
        expect(jsonPropertyStore.isRequired(0)).toEqual(false);
        expect(jsonPropertyStore.isRequired("")).toEqual(false);
        expect(jsonPropertyStore.isRequired(null)).toEqual(false);
        expect(jsonPropertyStore.isRequired(undefined)).toEqual(false);
      });
    });
  });
  describe("get()", () => {
    class Test {
      test: string;
    }

    it("should return the jsonPropertyStore", () => {
      const jsonPropertyStore = JsonPropertyStore.get(Test, "test");
      expect(jsonPropertyStore).toBeInstanceOf(JsonPropertyStore);
    });
  });
});
