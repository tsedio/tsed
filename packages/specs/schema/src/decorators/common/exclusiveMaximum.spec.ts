import {expect} from "chai";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {ExclusiveMaximum} from "./exclusiveMaximum";

describe("@ExclusiveMaximum", () => {
  it("should declare exclusiveMaximum value", () => {
    // WHEN
    class Model {
      @ExclusiveMaximum(0, true)
      num: number;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
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

    expect(classSchema.schema.toJSON()).to.deep.equal({
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
