import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {CollectionOf} from "./collectionOf.js";
import {MinItems} from "./minItems.js";

describe("@MinItems", () => {
  it("should declare a prop", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      @MinItems(10)
      num: number[];
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
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
    expect(actualError.message).toBe("The value of minItems MUST be a non-negative integer.");
  });
});
