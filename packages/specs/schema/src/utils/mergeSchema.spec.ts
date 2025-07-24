import type {JSONSchema7} from "json-schema";

import {mergeSchema} from "./mergeSchema.js";

describe("mergeSchema", () => {
  it("should merge two simple schemas (merge method)", () => {
    const schema1 = {
      type: "object",
      properties: {
        prop1: {type: "string"}
      }
    } satisfies JSONSchema7;

    const schema2 = {
      type: "object",
      properties: {
        prop2: {type: "number"}
      }
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "properties": {
          "prop1": {
            "type": "string",
          },
          "prop2": {
            "type": "number",
          },
        },
        "type": "object",
      }
    `);
  });
  it("should merge schemas with common properties", () => {
    const schema1 = {
      type: "object",
      properties: {
        common: {type: "string"}
      }
    } satisfies JSONSchema7;
    const schema2 = {
      type: "object",
      properties: {
        common: {type: "string", format: "email"}
      }
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "properties": {
          "common": {
            "format": "email",
            "type": "string",
          },
        },
        "type": "object",
      }
    `);
  });
  it("should merge required fields", () => {
    const schema1 = {
      type: "object",
      properties: {
        prop1: {type: "string"}
      },
      required: ["prop1"]
    } satisfies JSONSchema7;
    const schema2 = {
      type: "object",
      properties: {
        prop2: {type: "number"}
      },
      required: ["prop2"]
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "properties": {
          "prop1": {
            "type": "string",
          },
          "prop2": {
            "type": "number",
          },
        },
        "required": [
          "prop1",
          "prop2",
        ],
        "type": "object",
      }
    `);
  });
  it("should merge nested objects", () => {
    const schema1 = {
      type: "object",
      properties: {
        nested: {
          type: "object",
          properties: {
            prop1: {type: "string"}
          }
        }
      }
    } satisfies JSONSchema7;

    const schema2 = {
      type: "object",
      properties: {
        nested: {
          type: "object",
          properties: {
            prop2: {type: "number"}
          }
        }
      }
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "properties": {
          "nested": {
            "properties": {
              "prop1": {
                "type": "string",
              },
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        },
        "type": "object",
      }
    `);
  });
  it("should merge schemas both $ref", () => {
    const schema1 = {
      $ref: "#/definitions/Model1"
    } satisfies JSONSchema7;

    const schema2 = {
      $ref: "#/definitions/Model2"
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/definitions/Model1",
          },
          {
            "$ref": "#/definitions/Model2",
          },
        ],
      }
    `);
  });
  it("should deduplicate $ref", () => {
    const schema1 = {
      $ref: "#/definitions/Model1"
    } satisfies JSONSchema7;

    const schema2 = {
      $ref: "#/definitions/Model1"
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "$ref": "#/definitions/Model1",
      }
    `);
  });
  it("should merge schemas with $ref and simple schema", () => {
    const schema1 = {
      $ref: "#/definitions/Model1"
    } satisfies JSONSchema7;

    const schema2 = {
      type: "object",
      properties: {
        prop2: {type: "number"}
      }
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/definitions/Model1",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with simple schema and $ref", () => {
    const schema1 = {
      type: "object",
      properties: {
        prop1: {type: "string"}
      }
    } satisfies JSONSchema7;

    const schema2 = {
      $ref: "#/definitions/Model2"
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "$ref": "#/definitions/Model2",
          },
        ],
      }
    `);
  });
  it("should merge schemas with $ref and allOf", () => {
    const schema1 = {
      $ref: "#/definitions/Model1"
    } satisfies JSONSchema7;

    const schema2 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop2: {type: "number"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/definitions/Model1",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with allOf and $ref", () => {
    const schema1 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop1: {type: "string"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const schema2 = {
      $ref: "#/definitions/Model2"
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "$ref": "#/definitions/Model2",
          },
        ],
      }
    `);
  });
  it("should merge schemas with allOf and allOf (allOf method)", () => {
    const schema1 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop1: {type: "string"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const schema2 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop2: {type: "number"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with allOf and allOf (merge method)", () => {
    const schema1 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop1: {type: "string"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const schema2 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop2: {type: "number"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schema with allOf and a simple schema", () => {
    const schema1 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop1: {type: "string"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const schema2 = {
      type: "object",
      properties: {
        prop2: {type: "number"}
      }
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with simple schema and allOf", () => {
    const schema1 = {
      type: "object",
      properties: {
        prop1: {type: "string"}
      }
    } satisfies JSONSchema7;

    const schema2 = {
      allOf: [
        {
          type: "object",
          properties: {
            prop2: {type: "number"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with oneOf and oneOf", () => {
    const schema1 = {
      oneOf: [
        {
          type: "object",
          properties: {
            prop1: {type: "string"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const schema2 = {
      oneOf: [
        {
          type: "object",
          properties: {
            prop2: {type: "number"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "oneOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with oneOf and a simple schema", () => {
    const schema1 = {
      oneOf: [
        {
          type: "object",
          properties: {
            prop1: {type: "string"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const schema2 = {
      type: "object",
      properties: {
        prop2: {type: "number"}
      }
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "oneOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with a simple schema and anyOf", () => {
    const schema1 = {
      type: "object",
      properties: {
        prop1: {type: "string"}
      }
    } satisfies JSONSchema7;

    const schema2 = {
      anyOf: [
        {
          type: "object",
          properties: {
            prop2: {type: "number"}
          }
        }
      ]
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "anyOf": [
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
          {
            "properties": {
              "prop2": {
                "type": "number",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("should merge schemas with additionalProperties", () => {
    const schema1 = {
      type: "object",
      additionalProperties: {
        type: "string"
      }
    } satisfies JSONSchema7;

    const schema2 = {
      type: "object",
      additionalProperties: {
        type: "number"
      }
    } satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "additionalProperties": {
          "type": "number",
        },
        "type": "object",
      }
    `);
  });
  it("should optimize schema if $ref and empty {}", () => {
    const schema2 = {
      $ref: "#/definitions/Model1"
    } satisfies JSONSchema7;

    const schema1 = {} satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "$ref": "#/definitions/Model1",
      }
    `);
  });
  it("should optimize schema if {} and empty $ref", () => {
    const schema1 = {
      $ref: "#/definitions/Model1"
    } satisfies JSONSchema7;

    const schema2 = {} satisfies JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "$ref": "#/definitions/Model1",
      }
    `);
  });
  it("should optimize schema and avoid duplicated $ref over allOf", () => {
    const schema1 = {$ref: "#/components/schemas/TestPerson"};
    const schema2 = {
      allOf: [{$ref: "#/components/schemas/TestPerson"}, {readOnly: true}]
    };

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/components/schemas/TestPerson",
          },
          {
            "readOnly": true,
          },
        ],
      }
    `);
  });
  it("should fix a bug with $ref and oneOf with the same $ref", () => {
    const schema1 = {$ref: "#/definitions/Model"};
    const schema2 = {
      oneOf: [
        {
          type: "string",
          examples: ["5ce7ad3028890bd71749d477"],
          description: "A reference ObjectID"
        },
        {$ref: "#/definitions/Model"}
      ]
    } as JSONSchema7;

    const result = mergeSchema(schema1, schema2);

    expect(result).toMatchInlineSnapshot(`
      {
        "oneOf": [
          {
            "$ref": "#/definitions/Model",
          },
          {
            "description": "A reference ObjectID",
            "examples": [
              "5ce7ad3028890bd71749d477",
            ],
            "type": "string",
          },
        ],
      }
    `);
  });

  it("should simplify allOf if there two schema with type object", () => {
    const schema1 = {
      allOf: [
        {$ref: "#/components/schemas/Pagination"},
        {
          properties: {
            prop1: {type: "string"}
          },
          type: "object"
        }
      ]
    } as JSONSchema7;
    const schema2 = {type: "object"} as JSONSchema7;

    expect(mergeSchema(schema1, schema2)).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/components/schemas/Pagination",
          },
          {
            "properties": {
              "prop1": {
                "type": "string",
              },
            },
            "type": "object",
          },
        ],
      }
    `);
  });
  it("shouldn't simplify array items", () => {
    const schema = {};
    const extraSchema = {
      anyOf: [
        {type: "number"},
        {type: "boolean"},
        {type: "string"},
        {
          type: "array",
          items: {type: "number"}
        },
        {type: "array", items: {type: "string"}}
      ]
    } as JSONSchema7;

    const result = mergeSchema(schema, extraSchema);

    expect(result).toMatchInlineSnapshot(`
      {
        "anyOf": [
          {
            "type": "number",
          },
          {
            "type": "boolean",
          },
          {
            "type": "string",
          },
          {
            "items": {
              "type": "number",
            },
            "type": "array",
          },
          {
            "items": {
              "type": "string",
            },
            "type": "array",
          },
        ],
      }
    `);
  });
  it("should merge schemas with oneOf and preserve required fields, even if discriminator is present", () => {
    const schema1 = {};
    const extraSchema = {
      oneOf: [{$ref: "#/definitions/PageView"}, {$ref: "#/definitions/Action"}],
      discriminator: {propertyName: "type"},
      required: ["type"]
    };

    const result = mergeSchema(schema1, extraSchema);

    expect(result).toMatchInlineSnapshot(`
      {
        "discriminator": {
          "propertyName": "type",
        },
        "oneOf": [
          {
            "$ref": "#/definitions/PageView",
          },
          {
            "$ref": "#/definitions/Action",
          },
        ],
        "required": [
          "type",
        ],
      }
    `);
  });
  it("should keep the nullable field if it is present in the schema", () => {
    const schema1 = {};
    const schema2 = {
      anyOf: [
        {
          type: "integer",
          multipleOf: 1
        },
        {type: "number"},
        {type: "string"},
        {type: "boolean"},
        {type: "array"},
        {type: "object"}
      ],
      nullable: true
    } as any;

    const result = mergeSchema(schema1, schema2);
    expect(result).toMatchInlineSnapshot(`
      {
        "anyOf": [
          {
            "multipleOf": 1,
            "type": "integer",
          },
          {
            "type": "number",
          },
          {
            "type": "string",
          },
          {
            "type": "boolean",
          },
          {
            "type": "array",
          },
          {
            "type": "object",
          },
        ],
        "nullable": true,
      }
    `);
  });
  it("should merge schemas with allOf and readOnly (remove type)", () => {
    const schema = {$ref: "#/components/schemas/TestPerson"};
    const extraSchema = {type: "object", readOnly: true} as JSONSchema7;

    expect(mergeSchema(schema, extraSchema)).toMatchInlineSnapshot(`
      {
        "allOf": [
          {
            "$ref": "#/components/schemas/TestPerson",
          },
          {
            "readOnly": true,
          },
        ],
      }
    `);
  });
});
