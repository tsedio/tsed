import {compile} from "../../utils/compile.js";
import {CollectionOf} from "./collectionOf.js";
import {UniqueItems} from "./uniqueItems.js";

describe("@UniqueItems", () => {
  it("should declare a prop", () => {
    // WHEN
    class Model {
      @CollectionOf(Number)
      @UniqueItems(true)
      num: number[];
    }

    // THEN
    expect(compile(Model)).toEqual({
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
