import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {Default} from "./default.js";

describe("@Default", () => {
  it("should declare prop", () => {
    // WHEN
    class Model {
      @Default("10")
      num: string = "10";

      constructor() {}
    }

    // THEN
    expect(getJsonSchema(Model)).toEqual({
      properties: {
        num: {
          default: "10",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
