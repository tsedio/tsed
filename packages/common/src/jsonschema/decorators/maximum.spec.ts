import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Maximum} from "../../../src/jsonschema";

describe("Maximum", () => {
  it("should store data", () => {
    class Model {
      @Maximum(10)
      property: number;
    }

    expect(getJsonSchema(Model)).to.deep.eq({
      properties: {
        property: {
          maximum: 10,
          type: "number"
        }
      },
      type: "object"
    });
  });
});
