import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {CollectionOf} from "./propertyType";

describe("@CollectionOf", () => {
  it("should create a propertyMetadata", () => {
    class Model {
      @CollectionOf(Number)
      test: number[];
    }

    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        test: {
          items: {
            type: "number"
          },
          type: "array"
        }
      },
      type: "object"
    });
  });
});
