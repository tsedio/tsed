import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Hidden} from "./hidden";

describe("@Hidden", () => {
  it("should generate the right json schema", () => {
    // WHEN
    class Model {
      @Hidden()
      prop: number;
    }

    expect(getJsonSchema(Model)).to.deep.equal({
      type: "object"
    });
  });
});
