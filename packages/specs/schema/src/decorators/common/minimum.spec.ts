import "../../index.js";

import {s} from "../../fn/index.js";
import {CollectionOf} from "../collections/collectionOf.js";
import {Min} from "./minimum.js";

describe("@Minimum", () => {
  it("should declare minimum value", () => {
    // WHEN
    class Model {
      @Min(0)
      num: number;
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          minimum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });

  it("should declare exclusive minimum value", () => {
    // WHEN
    class Model {
      @Min(0, true)
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

  it("should declare minimum value (collection)", () => {
    // WHEN
    class Model {
      @Min(0)
      @CollectionOf(Number)
      num: number[];
    }

    // THEN
    expect(s.compile(Model)).toEqual({
      properties: {
        num: {
          type: "array",
          items: {
            minimum: 0,
            type: "number"
          }
        }
      },
      type: "object"
    });
  });
});
