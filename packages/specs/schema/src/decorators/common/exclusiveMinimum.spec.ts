import "../../index.js";

import {s} from "../../fn/index.js";
import {ExclusiveMinimum} from "./exclusiveMinimum.js";

describe("@ExclusiveMinimum", () => {
  it("should declare exclusiveMinimum value", () => {
    // WHEN
    class Model {
      @ExclusiveMinimum(0, true)
      num: number;
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          exclusiveMinimum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });
  it("should declare exclusiveMinimum value (default value)", () => {
    // WHEN
    class Model {
      @ExclusiveMinimum(0)
      num: number;
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          exclusiveMinimum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });
});
