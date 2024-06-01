import {JsonMap} from "../domain/JsonMap.js";
import {toJsonMapCollection} from "./toJsonMapCollection.js";

describe("toJsonMapCollection", () => {
  it("should transform object to JsonMapCollection", () => {
    const result = toJsonMapCollection({
      test: {
        schema: "schema"
      }
    });

    expect(result).toEqual(
      new JsonMap({
        test: new JsonMap({schema: "schema"})
      })
    );
  });
});
