import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {MultipleOf} from "./multipleOf.js";

describe("MultipleOf", () => {
  it("should declare minimum value", () => {
    // WHEN
    class Model {
      @MultipleOf(2)
      num: number;
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        num: {
          multipleOf: 2,
          type: "number"
        }
      },
      type: "object"
    });
  });

  it("should throw an error when the given parameters is as negative integer", () => {
    let actualError: any;
    try {
      MultipleOf(-1);
    } catch (er) {
      actualError = er;
    }
    expect(actualError.message).toBe("The value of multipleOf MUST be a number, strictly greater than 0.");
  });
});
