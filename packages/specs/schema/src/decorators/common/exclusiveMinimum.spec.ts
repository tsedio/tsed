import {expect} from "chai";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {ExclusiveMinimum} from "./exclusiveMinimum";

describe("@ExclusiveMinimum", () => {
  it("should declare exclusiveMinimum value", () => {
    // WHEN
    class Model {
      @ExclusiveMinimum(0, true)
      num: number;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
