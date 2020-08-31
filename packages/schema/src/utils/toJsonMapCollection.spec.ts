import {expect} from "chai";
import {JsonMap} from "../domain/JsonMap";
import {toJsonMapCollection} from "./toJsonMapCollection";

describe("toJsonMapCollection", () => {
  it("should transform object to JsonMapCollection", () => {
    const result = toJsonMapCollection({
      test: {
        schema: "schema"
      }
    });

    expect(result).to.deep.eq(
      new JsonMap({
        test: new JsonMap({schema: "schema"})
      })
    );
  });
});
