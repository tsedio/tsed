import {expect} from "chai";
import {JsonSchemaStore} from "../../domain/JsonSchemaStore";
import {CollectionOf} from "../collections/collectionOf";
import {Max} from "./maximum";

describe("@Maximum", () => {
  it("should declare maximum value", () => {
    // WHEN
    class Model {
      @Max(0)
      num: number;
    }

    // THEN
    const classSchema = JsonSchemaStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          maximum: 0,
          type: "number"
        }
      },
      type: "object"
    });
  });

  it("should declare exclusive maximum value", () => {
    // WHEN
    class Model {
      @Max(0, true)
      num: number;
    }

    // THEN
    const classSchema = JsonSchemaStore.from(Model);

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
  it("should declare maximum value (collection)", () => {
    // WHEN
    class Model {
      @Max(0)
      @CollectionOf(Number)
      num: number[];
    }

    // THEN
    const classSchema = JsonSchemaStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        num: {
          type: "array",
          items: {
            maximum: 0,
            type: "number"
          }
        }
      },
      type: "object"
    });
  });
});
