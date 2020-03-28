import {CollectionOf, getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {MinItems} from "./minItems";
import {UniqueItems} from "./uniqueItems";

describe("@UniqueItems", () => {
  it("should declare a prop", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      @UniqueItems(true)
      num: number[];
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          items: {
            type: "number"
          },
          uniqueItems: true,
          type: "array"
        }
      },
      type: "object"
    });
  });
});
