import {getJsonSchema} from "@tsed/schema";
import {RecordOf} from "./recordOf";

describe("RecordOf()", () => {
  it("should store data", () => {
    type keys = "one" | "two";

    class Part {
      prop: string;
    }

    type Parts = Record<keys, Part>;

    class Test {
      @RecordOf(Part, "one", "two")
      parts: Parts;
    }

    expect(getJsonSchema(Test)).toEqual({
      definitions: {
        Part: {
          type: "object"
        }
      },
      type: "object",
      properties: {
        parts: {
          properties: {
            one: {
              $ref: "#/definitions/Part"
            },
            two: {
              $ref: "#/definitions/Part"
            }
          },
          type: "object"
        }
      }
    });
  });
});
