import "../../index.js";

import {s} from "../../fn/index.js";
import {CollectionOf} from "../collections/collectionOf.js";
import {Max} from "./maximum.js";

describe("@Maximum", () => {
  it("should declare maximum value", () => {
    // WHEN
    class Model {
      @Max(0)
      num: number;
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          maximum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });

  it("should declare exclusive maximum value", () => {
    // WHEN
    class Model {
      @Max(0, true)
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
  it("should declare maximum value (collection)", () => {
    // WHEN
    class Model {
      @Max(0)
      @CollectionOf(Number)
      num: number[];
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          type: "array",
          items: {
            maximum: 0,
            type: "number"
          }
        }
      },
      type: "object"
    });
  });
});
