import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Schema} from "./schema";

describe("Schema()", () => {
  it("should store data", () => {
    class Model {
      @Schema({description: "description"})
      test: number[];
    }

    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        test: {
          description: "description",
          type: "array"
        }
      },
      type: "object"
    });
  });
});
