import "../../index.js";

import {s} from "../../fn/index.js";
import {ExclusiveMaximum} from "./exclusiveMaximum.js";

describe("@ExclusiveMaximum", () => {
  it("should declare exclusiveMaximum value", () => {
    // WHEN
    class Model {
      @ExclusiveMaximum(0, true)
      num: number;
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          exclusiveMaximum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should declare exclusiveMaximum value (default value)", () => {
    // WHEN
    class Model {
      @ExclusiveMaximum(0)
      num: number;
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          exclusiveMaximum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });
});
