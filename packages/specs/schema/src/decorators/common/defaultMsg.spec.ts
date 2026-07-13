import {s} from "../../fn/index.js";
import {DefaultMsg} from "./defaultMsg.js";

describe("@DefaultMsg", () => {
  it("should declare default message", () => {
    // WHEN
    @DefaultMsg("foo should be a string")
    class Model {
      property: number;
    }

    // THEN
    const schema = s.compile(Model, {customKeys: true});

    expect(schema).toEqual({
      type: "object",
      errorMessage: {
        _: "foo should be a string"
      }
    });
  });
});
