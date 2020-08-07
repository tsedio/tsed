import {prototypeOf} from "@tsed/core";
import {expect} from "chai";
import {Name} from "./propertyName";
import {PropertyMetadata} from "../../mvc/models/PropertyMetadata";

describe("@Name", () => {
  it("should create a propertyMetadata", () => {
    class Test {
      @Name("name")
      test: string;
    }

    const propertyMetadata = PropertyMetadata.get(prototypeOf(Test), "test");

    expect(propertyMetadata.name).to.deep.eq("name");
  });
});
