import {CollectionOf, getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {UniqueItems} from "../../../src/jsonschema";

describe("UniqueItems", () => {
  it("should store data", () => {
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
