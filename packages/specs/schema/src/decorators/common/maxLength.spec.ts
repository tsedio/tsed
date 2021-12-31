import {JsonEntityStore} from "../../domain/JsonEntityStore";
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
    expect(getJsonSchema(Model)).toEqual({
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
    expect(actualError.message).toBe("The value of maxLength MUST be a non-negative integer.");
  });
  it("should declare minimum value (collection)", () => {
    // WHEN
    class Model {
      @MaxLength(0)
      @CollectionOf(String)
      words: string[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
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
