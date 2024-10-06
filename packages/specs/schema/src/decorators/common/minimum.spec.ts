import "../../index.js";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
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
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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

  it("should declare minimum value (collection)", () => {
    // WHEN
    class Model {
      @Min(0)
      @CollectionOf(Number)
      num: number[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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
