import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {CollectionOf} from "./collectionOf.js";
import {MaxItems} from "./maxItems.js";

describe("@MaxItems", () => {
  it("should declare a prop", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      @MaxItems(10)
      num: number[];
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
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
    expect(actualError.message).toBe("The value of maxItems MUST be a non-negative integer.");
  });
});
