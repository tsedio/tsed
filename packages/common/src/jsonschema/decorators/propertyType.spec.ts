import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";
import {CollectionOf} from "./propertyType";

describe("@CollectionOf", () => {
  it("should create a propertyMetadata", () => {
    class Test {
      @CollectionOf(Number)
      test: number[];
    }

    const propertyMetadata = PropertyMetadata.get(prototypeOf(Test), "test");

    expect(propertyMetadata.type).to.eq(Number);
    expect(propertyMetadata.isCollection).to.eq(true);
  });
});
