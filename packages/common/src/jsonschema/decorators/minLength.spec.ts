import {JsonEntityStore} from "@tsed/schema";
import {expect} from "chai";
import {MinLength} from "./minLength";

describe("MinLength", () => {
  it("should store data", () => {
    // WHEN
    class Model {
      @MinLength(0)
      word: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        word: {
          minLength: 0,
          type: "string"
        }
      },
      type: "object"
    });
  });
});
