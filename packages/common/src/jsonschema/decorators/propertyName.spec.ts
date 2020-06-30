import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import {PropertyMetadata, PropertyName} from "../../../src/jsonschema";

describe("@PropertyName", () => {
  it("should create a propertyMetadata", () => {
    class Test {
      @PropertyName("name")
      test: string;
    }

    const propertyMetadata = PropertyMetadata.get(prototypeOf(Test), "test");

    expect(propertyMetadata.name).to.deep.eq("name");
  });
});
