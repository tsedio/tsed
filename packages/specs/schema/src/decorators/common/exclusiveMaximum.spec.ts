import "../../index.js";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {ExclusiveMaximum} from "./exclusiveMaximum.js";

describe("@ExclusiveMaximum", () => {
  it("should declare exclusiveMaximum value", () => {
    // WHEN
    class Model {
      @ExclusiveMaximum(0, true)
      num: number;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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
