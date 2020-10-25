import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {ExclusiveMaximum} from "../../../src/jsonschema";

describe("ExclusiveMaximum", () => {
  it("should store data", () => {
    class Model {
      @ExclusiveMaximum(10)
      property: number;
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      properties: {
        property: {
          exclusiveMaximum: 10,
          type: "number"
        }
      },
      type: "object"
    });
  });
});
