import {CollectionOf, getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {MinItems} from "./minItems";

describe("@MinItems", () => {
  it("should declare a prop", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      @MinItems(10)
      num: number[];
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          items: {
            type: "number"
          },
          minItems: 10,
          type: "array"
        }
      },
      type: "object"
    });
  });
  it("should throw error", () => {
    // WHEN
    let actualError: any;
    try {
      MinItems(-1);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.equal("The value of minItems MUST be a non-negative integer.");
  });
});
