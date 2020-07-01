import {expect} from "chai";
import {getJsonSchema} from "../../../src/jsonschema";
import {Integer} from "./integer";

describe("Integer", () => {
  it("should store data", () => {
    class IntegerModel {
      @Integer()
      prop: number;
    }

    expect(getJsonSchema(IntegerModel)).to.deep.eq({
      "properties": {
        "prop": {
          "multipleOf": 1,
          "type": "integer"
        }
      },
      "type": "object"
    });
  });
});
