import {getJsonSchema} from "../../utils/getJsonSchema";
import {TypeError} from "./typeError";

describe("@TypeError", () => {
  it("should declare type error message", () => {
    // WHEN
    @TypeError("foo should be a string")
    class Model {
      property: number;
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      type: "object",
      errorMessage: {
        type: "foo should be a string"
      }
    });
  });
});
