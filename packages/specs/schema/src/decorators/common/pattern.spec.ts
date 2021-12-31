import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {Pattern} from "./pattern";
import "../../components";

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
