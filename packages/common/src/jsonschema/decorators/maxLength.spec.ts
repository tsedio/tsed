import {JsonEntityStore} from "@tsed/schema";
import {expect} from "chai";
import {MaxLength} from "./maxLength";

describe("MaxLength", () => {
  it("should store data", () => {
    // WHEN
    class Model {
      @MaxLength(10)
      word: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        word: {
          maxLength: 10,
          type: "string"
        }
      },
      type: "object"
    });
  });
});
