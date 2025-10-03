import "../../src/index.js";

import {BadRequest} from "@tsed/exceptions";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, ParamValidationError, ValidationPipe} from "@tsed/platform-params";
import {CollectionOf, getJsonSchema, JsonParameterStore, Nullable, Property} from "@tsed/schema";

async function validate(value: any, metadata: any) {
  const pipe: ValidationPipe = await PlatformTest.invoke<ValidationPipe>(ValidationPipe);

  try {
    return await pipe.transform(value, metadata);
  } catch (er) {
    if (er instanceof BadRequest) {
      return ParamValidationError.from(metadata, er);
    }

    throw er;
  }
}

class NestedModel {
  @Property()
  id: string;
}

class NullModel {
  @Nullable(String)
  prop1: string | null;

  @Nullable(Number)
  prop2: number;

  @Nullable(Date)
  prop3: Date | null;

  @Nullable(NestedModel)
  prop4: NestedModel | null;

  @Nullable(Array)
  prop5: string[] | null;
}

class NoNullableModel {
  @Property()
  prop1: string;

  @Property()
  prop2: number;

  @Property()
  prop3: Date;

  @Property()
  prop4: NestedModel;

  @CollectionOf(String)
  prop5: string[];
}

describe("Nullable model", () => {
  describe("when returnsCoercedValues is false", () => {
    beforeEach(() =>
      PlatformTest.create({
        ajv: {
          coerceTypes: "array"
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should validate object and returns the original value (NullModel)", async () => {
      class Ctrl {
        get(@BodyParams() value: NullModel) {}
      }

      const value = {
        prop1: null,
        prop2: null,
        prop3: null,
        prop4: null,
        prop5: null
      };

      expect(getJsonSchema(NullModel)).toMatchInlineSnapshot(`
        {
          "definitions": {
            "NestedModel": {
              "properties": {
                "id": {
                  "type": "string",
                },
              },
              "type": "object",
            },
          },
          "properties": {
            "prop1": {
              "type": [
                "null",
                "string",
              ],
            },
            "prop2": {
              "type": [
                "null",
                "number",
              ],
            },
            "prop3": {
              "type": [
                "null",
                "string",
              ],
            },
            "prop4": {
              "oneOf": [
                {
                  "type": "null",
                },
                {
                  "$ref": "#/definitions/NestedModel",
                },
              ],
            },
            "prop5": {
              "$comment": "Warning: you should not use @Nullable(Array), which leads to an incorrect schema. Use @Schema(array().items().nullable()) instead",
              "type": [
                "null",
                "array",
              ],
            },
          },
          "type": "object",
        }
      `);

      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual({
        prop1: null,
        prop2: null,
        prop3: null,
        prop4: null,
        prop5: null
      });

      const result2 = await validate(
        {
          prop1: "test",
          prop2: 1,
          prop3: "2020-01-01",
          prop4: {
            id: "id"
          },
          prop5: ["test"]
        },
        JsonParameterStore.get(Ctrl, "get", 0)
      );

      expect(result2).toEqual({
        prop1: "test",
        prop2: 1,
        prop3: "2020-01-01",
        prop4: {
          id: "id"
        },
        prop5: ["test"]
      });
    });
    it("should validate object and returns the original value (NoNullableModel)", async () => {
      class Ctrl {
        get(@BodyParams() value: NoNullableModel) {}
      }

      const value = {
        prop1: null,
        prop2: null,
        prop3: null,
        prop5: null
      };

      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual({
        prop1: null,
        prop2: null,
        prop3: null,
        prop5: null
      });
    });
  });
  describe("when returnsCoercedValues is true", () => {
    beforeEach(() =>
      PlatformTest.create({
        ajv: {
          verbose: true,
          coerceTypes: "array",
          returnsCoercedValues: true
        }
      })
    );
    afterEach(() => PlatformTest.reset());
    it("should validate object and return the coerced value (NullModel)", async () => {
      class Ctrl {
        get(@BodyParams() value: NullModel) {}
      }

      const value = {
        prop1: null,
        prop2: null,
        prop3: null,
        prop4: null,
        prop5: null
      };

      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual(value);
    });
    it("should validate object and return the coerced value (NoNullableModel)", async () => {
      class Ctrl {
        get(@BodyParams() value: NoNullableModel) {}
      }

      const value = {
        prop1: null,
        prop2: null,
        prop3: null,
        prop5: null
      };

      const result = await validate(value, JsonParameterStore.get(Ctrl, "get", 0));

      expect(result).toEqual({
        prop1: "",
        prop2: 0,
        prop3: "",
        prop5: [""]
      });
    });
  });
});
