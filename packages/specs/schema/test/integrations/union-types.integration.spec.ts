import {Ajv} from "ajv";

import {AdditionalProperties, AnyOf, Enum, s} from "../../src/index.js";

describe("Union on model", () => {
  it("should return the expected schema", () => {
    enum Color {
      RED = "red",
      GREEN = "green",
      BLUE = "blue"
    }

    @AdditionalProperties(false)
    class GetColorsQueryParameters {
      @AnyOf(s.string().enum(Color), s.array().items(s.string().enum(Color)))
      public color: Color | Color[];
    }

    const schema = s.compile(GetColorsQueryParameters);

    expect(schema).toEqual({
      additionalProperties: false,
      properties: {
        color: {
          anyOf: [
            {
              enum: ["red", "green", "blue"],
              type: "string"
            },
            {
              items: {
                enum: ["red", "green", "blue"],
                type: "string"
              },
              type: "array"
            }
          ]
        }
      },
      type: "object"
    });

    const ajv = new Ajv({});

    expect(
      ajv.validate(schema, {
        color: "blue"
      })
    ).toEqual(true);
    expect(
      ajv.validate(schema, {
        color: ["blue"]
      })
    ).toEqual(true);
  });
  it("should return the expected schema (no union)", () => {
    enum Color {
      RED = "red",
      GREEN = "green",
      BLUE = "blue"
    }

    @AdditionalProperties(false)
    class GetColorsQueryParameters {
      @Enum(Color)
      public color: Color[];
    }

    const schema = s.compile(GetColorsQueryParameters);

    expect(schema).toEqual({
      additionalProperties: false,
      properties: {
        color: {
          items: {
            enum: ["red", "green", "blue"],
            type: "string"
          },
          type: "array"
        }
      },
      type: "object"
    });

    const ajv = new Ajv({
      coerceTypes: "array"
    });

    expect(
      ajv.validate(schema, {
        color: "blue"
      })
    ).toEqual(true);
    expect(
      ajv.validate(schema, {
        color: ["blue"]
      })
    ).toEqual(true);
  });
});
