import {prototypeOf} from "@tsed/core";
import {PropertyRegistry, PropertyType} from "../../../src/jsonschema";

describe("@PropertyType", () => {
  it("should create a propertyMetadata", () => {
    class Test {
      @PropertyType(Number)
      test: number[];
    }

    const propertyMetadata = PropertyRegistry.get(prototypeOf(Test), "test");

    propertyMetadata.type.should.eq(Number);
    propertyMetadata.isCollection.should.eq(true);
  });
});
