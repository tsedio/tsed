import {JsonMap} from "@tsed/schema";
import {expect} from "chai";

describe("JsonMap", () => {
  it("should serialize a JsonMap", () => {
    const map = new JsonMap({
      id: "id"
    });

    expect(map.toJSON()).to.deep.eq({
      id: "id"
    });
  });
});
