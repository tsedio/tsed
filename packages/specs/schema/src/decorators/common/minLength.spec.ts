import "@tsed/schema";
import {JsonEntityStore} from "../../domain/JsonEntityStore";
import {getJsonSchema} from "../../utils/getJsonSchema";
import {CollectionOf} from "../collections/collectionOf";
import {MinLength} from "./minLength";

describe("@MinLength", () => {
  it("should declare minimum value", () => {
    // WHEN
    class Model {
      @MinLength(0)
      word: string;
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        word: {
          minLength: 0,
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
      MinLength(-1);
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).toBe("The value of minLength MUST be a non-negative integer.");
  });
  it("should declare minimum value on type (collection)", () => {
    // WHEN
    class Model {
      @MinLength(0)
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
            minLength: 0,
            type: "string"
          }
        }
      },
      type: "object"
    });
  });
  it("should declare minimum value on collection (collection)", () => {
    // WHEN
    class Model {
      @MinLength(0)
      @CollectionOf(String).MinItems(0).MaxItems(10)
      words: string[];
    }

    // THEN
    const classSchema = JsonEntityStore.from(Model);

    expect(classSchema.schema.toJSON()).toEqual({
      properties: {
        words: {
          type: "array",
          items: {
            minLength: 0,
            type: "string"
          },
          maxItems: 10,
          minItems: 0
        }
      },
      type: "object"
    });
  });

  it("should declare minLength field with custom error message", () => {
    // WHEN
    class Model {
      @MinLength(2).Error("Require at least 2 characters")
      @CollectionOf(String).MinItems(0).MaxItems(10)
      words: string[];
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      errorMessage: {
        minLength: "Require at least 2 characters"
      },
      properties: {
        words: {
          items: {
            minLength: 2,
            type: "string"
          },
          maxItems: 10,
          minItems: 0,
          type: "array"
        }
      },
      type: "object"
    });
  });
});
