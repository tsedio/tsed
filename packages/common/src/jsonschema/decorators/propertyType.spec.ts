import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import {PropertyMetadata, PropertyType} from "../../../src/jsonschema";

describe("@PropertyType", () => {
  it("should create a propertyMetadata", () => {
    class Test {
      @PropertyType(Number)
      test: number[];
    }

    const propertyMetadata = PropertyMetadata.get(prototypeOf(Test), "test");

    expect(propertyMetadata.type).to.eq(Number);
    expect(propertyMetadata.isCollection).to.eq(true);
  });
});
