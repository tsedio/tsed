import "../../index.js";

import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {Pattern} from "./pattern.js";

describe("@Pattern", () => {
  it("should declare pattern value", () => {
    // WHEN
    class Model {
      @Pattern(/(a|b)/)
      num: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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
