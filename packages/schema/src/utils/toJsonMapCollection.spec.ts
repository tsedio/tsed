import {JsonMap} from "@tsed/schema";
import {expect} from "chai";
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
