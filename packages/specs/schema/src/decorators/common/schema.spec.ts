import {getJsonSchema} from "@tsed/schema";
import {Schema} from "./schema";

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
