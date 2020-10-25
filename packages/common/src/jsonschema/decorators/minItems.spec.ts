import {CollectionOf, getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {MinItems} from "./minItems";

describe("MinItems", () => {
  it("should store data", () => {
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
});
