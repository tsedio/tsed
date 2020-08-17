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
});
