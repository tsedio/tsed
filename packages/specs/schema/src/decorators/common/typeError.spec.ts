import {compile} from "../../utils/compile.js";
import {TypeError} from "./typeError.js";

describe("@TypeError", () => {
  it("should declare type error message", () => {
    // WHEN
    @TypeError("foo should be a string")
    class Model {
      property: number;
    }

    // THEN
    const schema = compile(Model, {customKeys: true});

    expect(schema).toEqual({
      type: "object",
      errorMessage: {
        type: "foo should be a string"
      }
    });
  });
});
