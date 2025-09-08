import {getJsonSchema} from "../../index.js";
import {Schema} from "./schema.js";

describe("Schema()", () => {
  it("should store data", () => {
    class Test {
      @Schema({
        items: {
          type: "string",
          pattern: /a|b/
        }
      })
      test: string[];
    }

    expect(getJsonSchema(Test)).toMatchInlineSnapshot(`
      {
        "properties": {
          "test": {
            "items": {
              "pattern": "a|b",
              "type": "string",
            },
            "type": "array",
          },
        },
        "type": "object",
      }
    `);
  });
});
