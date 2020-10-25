import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {MultipleOf} from "./multipleOf";

describe("MultipleOf", () => {
  it("should store data", () => {
    // WHEN
    class Model {
      @MultipleOf(2)
      num: number;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        num: {
          multipleOf: 2,
          type: "number"
        }
      },
      type: "object"
    });
  });
});
