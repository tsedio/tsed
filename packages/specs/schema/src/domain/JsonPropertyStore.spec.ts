import {prototypeOf} from "@tsed/core";
import {JsonClassStore, JsonPropertyStore, Required} from "@tsed/schema";
import {getJsonEntityStore} from "../utils/getJsonEntityStore";
import {expect} from "chai";

describe("JsonParameterStore", () => {
  it("should create entity with required value", () => {
    class TestDynamicUrlCtrl {
      @Required()
      prop: string;
    }

    const entity = getJsonEntityStore(prototypeOf(TestDynamicUrlCtrl), "prop");

    expect(entity).to.be.instanceof(JsonPropertyStore);
    expect(entity.parent).to.be.instanceof(JsonClassStore);
    expect(entity.parent.parent.parent).to.be.instanceof(JsonClassStore);
    expect(entity.nestedGenerics).to.deep.eq([]);
    expect(entity.required).to.eq(true);
    expect(entity.isRequired("")).to.eq(true);
    expect(entity.allowedRequiredValues).to.deep.eq([]);

    entity.required = false;
    expect(entity.required).to.eq(false);

    entity.required = true;
    expect(entity.required).to.eq(true);
  });
  it("should create entity with allowed value", () => {
    class TestDynamicUrlCtrl {
      @Required(true, "")
      prop: string;
    }

    const entity = getJsonEntityStore(prototypeOf(TestDynamicUrlCtrl), "prop");

    expect(entity).to.be.instanceof(JsonPropertyStore);
    expect(entity.parent).to.be.instanceof(JsonClassStore);
    expect(entity.parent.parent.parent).to.be.instanceof(JsonClassStore);
    expect(entity.nestedGenerics).to.deep.eq([]);
    expect(entity.required).to.eq(true);
    expect(entity.isRequired("")).to.eq(false);
    expect(entity.allowedRequiredValues).to.deep.eq([""]);

    entity.required = false;
    expect(entity.required).to.eq(false);

    entity.required = true;
    expect(entity.required).to.eq(true);
  });
});
