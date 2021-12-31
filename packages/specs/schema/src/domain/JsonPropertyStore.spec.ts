import {prototypeOf} from "@tsed/core";
import {JsonClassStore, JsonPropertyStore, Required} from "@tsed/schema";
import {getJsonEntityStore} from "../utils/getJsonEntityStore";

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
});
