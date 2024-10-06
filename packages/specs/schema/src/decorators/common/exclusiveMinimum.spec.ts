import "../../index.js";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {ExclusiveMinimum} from "./exclusiveMinimum.js";

describe("@ExclusiveMinimum", () => {
  it("should declare exclusiveMinimum value", () => {
    // WHEN
    class Model {
      @ExclusiveMinimum(0, true)
      num: number;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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
