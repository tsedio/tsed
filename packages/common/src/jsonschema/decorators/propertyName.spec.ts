import {expect} from "chai";
import {prototypeOf} from "@tsed/core";
import {PropertyName, PropertyRegistry} from "../../../src/jsonschema";

describe("@PropertyName", () => {
  it("should create a propertyMetadata", () => {
    class Test {
      @PropertyName("name")
      test: string;
    }

    const propertyMetadata = PropertyRegistry.get(prototypeOf(Test), "test");

    expect(propertyMetadata.name).to.deep.eq("name");
  });
});
