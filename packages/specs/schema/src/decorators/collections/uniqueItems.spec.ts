import {getJsonSchema} from "../../utils/getJsonSchema";
import {CollectionOf} from "./collectionOf";
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
    expect(getJsonSchema(Model)).toEqual({
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
