import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import {PropertyName} from "./propertyName";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";

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
