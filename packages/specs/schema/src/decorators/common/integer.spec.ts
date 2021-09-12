import {expect} from "chai";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {Integer} from "./integer";

describe("@Integer", () => {
  it("should generate the right json schema", () => {
    // WHEN
    class Model {
      @Integer()
      prop: number;
    }

    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        prop: {
          multipleOf: 1,
          type: "integer"
        }
      },
      type: "object"
    });
  });
});
