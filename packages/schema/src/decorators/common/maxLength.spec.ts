import {expect} from "chai";
import {JsonSchemaStore} from "../../domain/JsonSchemaStore";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {CollectionOf} from "../collections/collectionOf";
import {MaxLength} from "./maxLength";

describe("@MaxLength", () => {
  it("should declare minimum value", () => {
    // WHEN
    class Model {
      @MaxLength(0)
      word: string;
    }

    // THEN
    expect(getJsonSchema(Model)).to.deep.equal({
      properties: {
        word: {
          maxLength: 0,
          type: "string"
        }
      },
      type: "object"
    });
  });
  it("should throw error", () => {
    // WHEN
    let actualError: any;
    try {
      MaxLength(-1);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).to.equal("The value of maxLength MUST be a non-negative integer.");
  });
  it("should declare minimum value (collection)", () => {
    // WHEN
    class Model {
      @MaxLength(0)
      @CollectionOf(String)
      words: string[];
    }

    // THEN
    const classSchema = JsonSchemaStore.from(Model);

    expect(classSchema.schema.toJSON()).to.deep.equal({
      properties: {
        words: {
          type: "array",
          items: {
            maxLength: 0,
            type: "string"
          }
        }
      },
      type: "object"
    });
  });
});
