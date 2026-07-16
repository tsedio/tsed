import "../../index.js";
import {Pattern} from "./pattern.js";
import {s} from "../../fn/index.js";

describe("@Pattern", () => {
  it("should declare pattern value", () => {
    // WHEN
    class Model {
      @Pattern(/(a|b)/)
      num: string;
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          pattern: "(a|b)",
          type: "string"
        }
      },
      type: "object"
    });
  });
});
