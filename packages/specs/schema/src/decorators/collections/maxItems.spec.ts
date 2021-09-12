import {CollectionOf, getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {MaxItems} from "./maxItems";

describe("@MaxItems", () => {
  it("should declare a prop", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      @MaxItems(10)
      num: number[];
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          items: {
            type: "number"
          },
          maxItems: 10,
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
      MaxItems(-1);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.equal("The value of maxItems MUST be a non-negative integer.");
  });
});
