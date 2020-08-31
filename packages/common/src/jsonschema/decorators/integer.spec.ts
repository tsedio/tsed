import {expect} from "chai";
import {getJsonSchema, Schema} from "../../../src/jsonschema";
import {Integer} from "./integer";

describe("Integer", () => {
  it("should store data", () => {
    class IntegerModel {
      @Integer()
      prop: number;
    }

    expect(getJsonSchema(IntegerModel)).to.deep.eq({
      definitions: {},
      properties: {
        prop: {
          type: "integer"
        }
      },
      type: "object"
    });
  });
});
