import {compile, SpecTypes} from "../../index.js";
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

    expect(compile(Test)).toMatchInlineSnapshot(`
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

  it("should support vendor extensions passed to @Schema", () => {
    class Test {
      @Schema({
        type: "string",
        "x-secret": true
      })
      test: string;
    }

    expect(compile(Test)).toEqual({
      properties: {
        test: {
          type: "string",
          "x-secret": true
        }
      },
      type: "object"
    });

    expect(compile(Test, {specType: SpecTypes.OPENAPI})).toEqual({
      properties: {
        test: {
          type: "string",
          "x-secret": true
        }
      },
      type: "object"
    });
  });
});
