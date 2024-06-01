import {getJsonSchema} from "../../index.js";
import {Schema} from "./schema.js";

describe("Schema()", () => {
  it("should store data", () => {
    class Test {
      @Schema({
        pattern: "a|b"
      })
      test: string;
    }

    expect(getJsonSchema(Test)).toEqual({
      properties: {
        test: {
          pattern: "a|b",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
