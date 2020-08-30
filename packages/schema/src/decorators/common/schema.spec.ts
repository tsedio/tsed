import {getJsonSchema} from "@tsed/schema";
import {expect} from "chai";
import {Schema} from "./schema";

describe("Schema()", () => {
  it("should store data", () => {
    class Test {
      @Schema({
        pattern: "a|b",
      })
      test: string;
    }

    expect(getJsonSchema(Test)).to.deep.equal({
      properties: {
        test: {
          pattern: "a|b",
          type: "string",
        },
      },
      type: "object",
    });
  });
});
