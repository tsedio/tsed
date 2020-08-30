import {expect} from "chai";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {Pattern} from "./pattern";

describe("@Pattern", () => {
  it("should declare pattern value", () => {
    // WHEN
    class Model {
      @Pattern(/(a|b)/)
      num: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          pattern: "(a|b)",
          type: "string",
        },
      },
      type: "object",
    });
  });
});
