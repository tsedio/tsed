import "../../index.js";

import {validateModel} from "../../../test/helpers/validateModel.js";
import {JsonEntityStore} from "../../domain/JsonEntityStore.js";
import {getJsonSchema} from "../../utils/getJsonSchema.js";
import {CollectionOf} from "../collections/collectionOf.js";
import {MinLength} from "./minLength.js";

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
      @(CollectionOf(String).MinItems(0).MaxItems(10))
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
      @(MinLength(2).Error("Require at least 2 characters"))
      @(CollectionOf(String).MinItems(0).MaxItems(10))
      words: string[];
    }

    // THEN
    const schema = getJsonSchema(Model, {customKeys: true});

    expect(schema).toEqual({
      properties: {
        words: {
          items: {
            minLength: 2,
            type: "string",
            errorMessage: {
              minLength: "Require at least 2 characters"
            }
          },
          maxItems: 10,
          minItems: 0,
          type: "array"
        }
      },
      type: "object"
    });

    const result = validateModel(
      {
        words: ["a"]
      },
      Model
    );

    expect(result).toEqual([
      {
        instancePath: "/words/0",
        keyword: "errorMessage",
        message: "Require at least 2 characters",
        params: {
          errors: [
            {
              emUsed: true,
              instancePath: "/words/0",
              keyword: "minLength",
              message: "must NOT have fewer than 2 characters",
              params: {
                limit: 2
              },
              schemaPath: "#/properties/words/items/minLength"
            }
          ]
        },
        schemaPath: "#/properties/words/items/errorMessage"
      }
    ]);
  });

  it("should throw error with custom error message", () => {
    // WHEN
    class Model {
      @(MinLength(10).Error("Title must be at least 10 characters long"))
      word: string;
    }

    // THEN

    const result = validateModel({word: "test"}, Model);

    expect(result).toEqual([
      {
        instancePath: "/word",
        keyword: "errorMessage",
        message: "Title must be at least 10 characters long",
        params: {
          errors: [
            {
              emUsed: true,
              instancePath: "/word",
              keyword: "minLength",
              message: "must NOT have fewer than 10 characters",
              params: {
                limit: 10
              },
              schemaPath: "#/properties/word/minLength"
            }
          ]
        },
        schemaPath: "#/properties/word/errorMessage"
      }
    ]);
  });
});
