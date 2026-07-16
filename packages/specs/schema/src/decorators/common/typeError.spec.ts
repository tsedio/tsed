import {TypeError} from "./typeError.js";
import {s} from "../../fn/index.js";

describe("@TypeError", () => {
  it("should declare type error message", () => {
    // WHEN
    @TypeError("foo should be a string")
    class Model {
      property: number;
    }

    // THEN
    const schema = s.compile(Model, {customKeys: true});

    expect(schema).toEqual({
      type: "object",
      errorMessage: {
        type: "foo should be a string"
      }
    });
  });
});
